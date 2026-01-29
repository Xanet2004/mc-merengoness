import { useMemo, useState } from 'react'
import Background from '../../components/Background/Background'
import GlassCard from '../../components/GlassCard/GlassCard'
import Button from '../../components/Button/Button'
import StatusPill from '../../components/StatusPill/StatusPill'
import PlayerChip from '../../components/PlayerChip/PlayerChip'
import { merengoness } from '../../config/merengoness'
import { useMinecraftStatus } from '../../hooks/useMinecraftSummary'
import styles from './Home.module.css'

function fullAddress(domain: string, port: number) {
  return port === 25565 ? domain : `${domain}:${port}`
}

async function copy(text: string) {
  await navigator.clipboard.writeText(text)
}

export default function Home() {
  const address = useMemo(() => fullAddress(merengoness.domain, merengoness.port), [])
  const { status, refresh } = useMinecraftStatus({ address, refreshMs: 60000 })
  const [toast, setToast] = useState<string | null>(null)

  const seedValue = (merengoness.seed ?? '').trim()

  const uiState =
    status.state === 'loading' ? 'loading' :
    status.state === 'unavailable' ? 'unavailable' :
    status.state === 'offline' ? 'offline' : 'online'

  const playersText =
    status.state === 'online'
      ? `${status.playersOnline}${status.playersMax ? ` / ${status.playersMax}` : ''}`
      : status.state === 'offline'
        ? '0'
        : '—'

  const versionText =
    status.state === 'online' ? (status.version ?? merengoness.fallbackVersion)
      : status.state === 'offline' ? (status.version ?? merengoness.fallbackVersion)
        : merengoness.fallbackVersion

  async function handleCopyIP() {
    try {
      await copy(address)
      setToast('IP kopiatuta ✓')
      window.setTimeout(() => setToast(null), 1200)
    } catch {
      setToast('Ezin izan da kopiatu (nabigatzailearen baimenak)')
      window.setTimeout(() => setToast(null), 1600)
    }
  }

  async function handleCopySeed() {
    if (!seedValue) return
    try {
      await copy(seedValue)
      setToast('Hazia kopiatuta ✓')
      window.setTimeout(() => setToast(null), 1200)
    } catch {
      setToast('Ezin izan da kopiatu (nabigatzailearen baimenak)')
      window.setTimeout(() => setToast(null), 1600)
    }
  }

  return (
    <div className={styles.page}>
      <Background />

      <a className={styles.skipLink} href="#main">Edukira salto</a>

      <div className={styles.wrap} id="main">
        <header className={styles.hero}>
          <p className={styles.subtitle}>{merengoness.subtitle}</p>
          <h1 className={styles.title}>{merengoness.name}</h1>
          <p className={styles.lead}>
            Lagunentzako zerbitzari pribatua. Hemen duzu helbidea, egoera eta aukerako deskargak.
          </p>

          <div className={styles.heroActions} aria-label="Ekintza nagusiak">
            <a className={styles.linkBtnPrimary} href="#sartu">Sartu</a>
            <Button onClick={() => refresh()} aria-label="Zerbitzariaren datuak eguneratu">
              Datuak eguneratu
            </Button>
            <a className={styles.linkBtn} href={merengoness.discordUrl} target="_blank" rel="noopener">
              Discord
            </a>
          </div>

          {toast && <div className={styles.toast} role="status" aria-live="polite">{toast}</div>}
        </header>

        <main className={styles.grid} aria-label="Edukia">
          <GlassCard title="Sartu" className={styles.cardSpan}>
            <div id="sartu" className={styles.joinRow}>
              <div className={styles.addressBar} role="group" aria-label="Zerbitzariaren helbidea">
                <span className={styles.addressLabel}>Helbidea</span>
                <span className={styles.addressText}>{address}</span>
                <Button variant="primary" onClick={handleCopyIP} className={styles.addressBtn}>
                  Kopiatu IP
                </Button>
              </div>

              <p className={styles.help}>
                Minecraft → Multijokalaria → “Zerbitzaria gehitu” → helbidea itsatsi → Sartu.
              </p>
            </div>
          </GlassCard>

          <GlassCard title="Egoera">
            <div className={styles.row}>
              <StatusPill state={uiState as any} />
              <span className={styles.tiny}>
                {status.lastCheck ? `Azken egiaztapena: ${status.lastCheck.toLocaleString()}` : '—'}
              </span>
            </div>

            <dl className={styles.dl}>
              <div className={styles.dlRow}>
                <dt className={styles.k}>Jokalariak</dt>
                <dd className={styles.v}>{playersText}</dd>
              </div>

              <div className={styles.dlRow}>
                <dt className={styles.k}>MOTD</dt>
                <dd className={`${styles.v} ${styles.muted}`}>
                  {status.state === 'online' ? (status.motd ?? '—') : '—'}
                </dd>
              </div>
            </dl>

            <div className={styles.k} style={{ marginTop: 'var(--s-4)' }}>Orain linean</div>
            <div className={styles.players} aria-label="Orain linean dauden jokalariak">
              {status.state === 'online' ? (
                status.playersList ? (
                  status.playersList.length ? (
                    status.playersList.map((p) => <PlayerChip key={p} name={p} />)
                  ) : (
                    <span className={styles.muted}>Inor ez dago linean.</span>
                  )
                ) : (
                  <span className={styles.muted}>Zerrenda ez dago eskuragarri (ping-aren arabera).</span>
                )
              ) : (
                <span className={styles.muted}>—</span>
              )}
            </div>
          </GlassCard>

          <GlassCard title="Deskargak (aukerakoa)">
            <p className={styles.muted} style={{ marginTop: 0 }}>
              Zerbitzariak ez du modik. Hau bezeroarentzat da: optimizazioa + shader/resourcepack aukerakoak.
            </p>

            <ul className={styles.list}>
              <li><strong>ZIP bezeroa</strong>: optimizazio-modak + shader/resourcepack aukerakoak.</li>
              <li><strong>Modrinth App</strong>: norbaitek aplikazioarekin instalatu nahi badu.</li>
            </ul>

            <div className={styles.row} style={{ marginTop: 'var(--s-4)' }}>
              <a className={styles.linkBtnPrimary} href={merengoness.downloads.clientZip} target="_blank" rel="noopener">
                Jaitsi ZIPa
              </a>
              <a className={styles.linkBtn} href={merengoness.downloads.modrinthApp} target="_blank" rel="noopener">
                Jaitsi Modrinth
              </a>
            </div>
          </GlassCard>

          <GlassCard title="Informazioa">
            <dl className={styles.dl}>
              <div className={styles.dlRow}>
                <dt className={styles.k}>Bertsioa</dt>
                <dd className={styles.v}><code className={styles.codeStrong}>{versionText}</code></dd>
              </div>

              <div className={styles.dlRow}>
                <dt className={styles.k}>Softwarea</dt>
                <dd className={styles.v}><code className={styles.codeStrong}>{merengoness.software}</code></dd>
              </div>

              <div className={styles.dlRow}>
                <dt className={styles.k}>Hazia</dt>
                <dd className={styles.v}>
                  <code className={styles.codeStrong}>
                    {seedValue ? seedValue : '— (konfiguratu merengoness.ts-en)'}
                  </code>
                  <span className={styles.inlineGap} />
                  <Button size="small" onClick={handleCopySeed} disabled={!seedValue}>
                    Hazia kopiatu
                  </Button>
                </dd>
              </div>

              <div className={styles.dlRow}>
                <dt className={styles.k}>Pluginak</dt>
                <dd className={styles.v}>
                  {merengoness.plugins.length ? (
                    merengoness.plugins.map((p) => (
                      <span key={p} className={styles.tag}><code className={styles.codeStrong}>{p}</code></span>
                    ))
                  ) : (
                    <span className={styles.muted}>Ez dago (oraingoz).</span>
                  )}
                </dd>
              </div>
            </dl>
          </GlassCard>

          <GlassCard title="Arauak">
            <ul className={styles.list}>
              <li>Ez tryhardeatu.</li>
              <li>Tontoarena egin.</li>
            </ul>

            <div className={styles.hr} />
            <p className={styles.tiny} style={{ marginTop: 'var(--s-3)' }}>
              Merengoness zerbitzari pribatua da.
            </p>
          </GlassCard>
        </main>

        <footer className={styles.footer}>
          <div>{merengoness.name} • <span className={styles.muted}>Minecraft zerbitzaria</span></div>
          <div>
            Made by <strong className={styles.footerName}>{merengoness.footerName}</strong> © {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </div>
  )
}

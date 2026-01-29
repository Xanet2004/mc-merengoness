import { useEffect, useMemo, useRef, useState } from 'react'

type McSrvStat = {
  online?: boolean
  players?: { online?: number; max?: number; list?: string[] }
  motd?: { clean?: string[] | string; raw?: any }
  version?: string
  software?: string
}

export type McStatus =
  | { state: 'loading'; lastCheck: Date | null }
  | {
      state: 'online'
      lastCheck: Date
      playersOnline: number
      playersMax: number | null
      playersList: string[] | null
      motd: string | null
      version: string | null
      software: string | null
    }
  | { state: 'offline'; lastCheck: Date; version: string | null; software: string | null }
  | { state: 'unavailable'; lastCheck: Date }

const STATUS_API = (addr: string) => `https://api.mcsrvstat.us/2/${encodeURIComponent(addr)}`

function motdToString(motd: McSrvStat['motd']): string | null {
  if (!motd) return null
  const clean = motd.clean
  if (Array.isArray(clean)) return clean.join(' ').trim() || null
  if (typeof clean === 'string') return clean.trim() || null
  return null
}

export function useMinecraftStatus(opts: { address: string; refreshMs?: number }) {
  const { address, refreshMs = 60000 } = opts
  const [status, setStatus] = useState<McStatus>({ state: 'loading', lastCheck: null })
  const timer = useRef<number | null>(null)

  const refresh = useMemo(() => {
    return async () => {
      try {
        const res = await fetch(STATUS_API(address), { cache: 'no-store' })
        const data = (await res.json()) as McSrvStat
        const now = new Date()

        const version = typeof data.version === 'string' ? data.version : null
        const software = typeof data.software === 'string' ? data.software : null

        if (!data.online) {
          setStatus({ state: 'offline', lastCheck: now, version, software })
          return
        }

        const playersOnline = data.players?.online ?? 0
        const playersMax = typeof data.players?.max === 'number' ? data.players.max : null
        const playersList = Array.isArray(data.players?.list) ? data.players!.list! : null

        setStatus({
          state: 'online',
          lastCheck: now,
          playersOnline,
          playersMax,
          playersList,
          motd: motdToString(data.motd),
          version,
          software,
        })
      } catch {
        setStatus({ state: 'unavailable', lastCheck: new Date() })
      }
    }
  }, [address])

  useEffect(() => {
    refresh()
    timer.current = window.setInterval(refresh, refreshMs)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [refresh, refreshMs])

  return { status, refresh }
}
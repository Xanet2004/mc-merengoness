import styles from './PlayerChip.module.css'

const headUrl = (name: string) => `https://mc-heads.net/avatar/${encodeURIComponent(name)}/32`

export default function PlayerChip(props: { name: string }) {
  return (
    <div className={styles.player}>
      <img className={styles.avatar} src={headUrl(props.name)} alt={`${props.name} head`} loading="lazy" />
      <span>{props.name}</span>
    </div>
  )
}

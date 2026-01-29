import styles from './StatusPill.module.css'

export default function StatusPill(props: { state: 'online' | 'offline' | 'loading' | 'unavailable' }) {
  const label =
    props.state === 'online' ? 'Linean' :
    props.state === 'offline' ? 'Lineaz kanpo' :
    props.state === 'unavailable' ? 'Egoera ez dago eskuragarri' :
    'Egiaztatzen…'

  const cls =
    props.state === 'online' ? styles.ok :
    props.state === 'offline' ? styles.bad :
    props.state === 'unavailable' ? styles.bad :
    styles.loading

  return (
    <span className={`${styles.pill} ${cls}`} aria-label={`Zerbitzariaren egoera: ${label}`}>
      <span className={styles.dot} />
      {label}
    </span>
  )
}

import styles from './Background.module.css'

export default function Background() {
  return (
    <>
      <div className={styles.bg} aria-hidden="true">
        <div className={`${styles.blob} ${styles.b1}`} />
        <div className={`${styles.blob} ${styles.b2}`} />
        <div className={`${styles.blob} ${styles.b3}`} />
      </div>

      <div className={styles.grain} aria-hidden="true" />
    </>
  )
}

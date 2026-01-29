import styles from './GlassCard.module.css'

export default function GlassCard(props: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`${styles.card} ${props.className ?? ''}`}>
      {props.title && <h2 className={styles.title}>{props.title}</h2>}
      <div className={styles.body}>{props.children}</div>
    </section>
  )
}

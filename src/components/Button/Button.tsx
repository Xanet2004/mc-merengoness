import styles from './Button.module.css'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
  size?: 'normal' | 'small'
}

export default function Button({ variant='secondary', size='normal', className, ...rest }: Props) {
  const cls = [
    styles.btn,
    variant === 'primary' ? styles.primary : styles.secondary,
    size === 'small' ? styles.small : '',
    className ?? '',
  ].join(' ')
  return <button className={cls} {...rest} />
}

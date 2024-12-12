import styles from './page.module.css';
import Link from 'next/link';
export default function Page({ children }: Readonly<{ children: React.ReactNode }>) {
  return(
    <div className={styles.page}>
      <Link href={'/login'} className='btn btn-primary'>Login</Link>
      <Link href={'/register'} className='btn btn-outline-primary'>Register</Link>
      <Link href="/validate" className='btn btn-outline-secondary'>Validate File</Link>
    </div>
  );
}

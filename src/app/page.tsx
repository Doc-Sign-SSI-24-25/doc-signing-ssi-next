import Input from './components/ui/input';
import styles from './page.module.css';
export default function Page({ children }: Readonly<{ children: React.ReactNode }>) {
  return(
    <div className={styles.page}>
      <aside className={styles.aside}>
        <Input label="Validate" type="text" id="validate" placeholder="Validate" />
      </aside>
      <main className={styles.main}>
        <a className='btn btn-outline-dark' href="/login">Login</a>
      </main>
    </div>
  );
}

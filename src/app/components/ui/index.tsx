import styles from './page.module.css';

export default function FileDownloader(props:any){
    return (
        <div className={styles.box}>
            <a href={props.url} download={props.filename} className={styles.button}>
                {props.children}
            </a>
        </div>
    )
}
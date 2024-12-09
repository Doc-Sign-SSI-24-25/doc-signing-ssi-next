import Input from "../ui/input";
import styles from "./email.module.css";

export default function Email() {
    return (
        <div className={styles.email}>
            <Input type="text" id="subject" name="subject" label="Assunto"  />
            <div className="form-group">
                <label htmlFor="message" className="form-label">Mensagem</label>
                <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows={5}
                    // value={props.message}
                    // onChange={props.onChangeMessage}
                />
            </div>
        </div>
    );
}
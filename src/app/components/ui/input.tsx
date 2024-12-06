export default function Input(props : any) {
    return (
        <div className="form-group">
            <label htmlFor={props.id} className="form-label">{props.label}</label>
            <input
                type={props.type}
                className="form-control"
                id={props.id}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
                {...props}
            />
        </div>
    );
}
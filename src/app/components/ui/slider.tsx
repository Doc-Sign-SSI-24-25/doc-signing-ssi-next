export default function Slider(props : any) {
    return (
        <div className="form-group">
            <label htmlFor={props.id} className="form-label">{props.label}</label>
            <input
                type="range"
                className="form-control"
                id={props.id}
                value={props.value}
                onChange={props.onChange}
                min={props.min}
                max={props.max}
                step={props.step}
                {...props}
            />
        </div>
    );
}
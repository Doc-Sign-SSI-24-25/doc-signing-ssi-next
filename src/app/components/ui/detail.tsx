export default function Detail(props: {
    detail: string
}) {
    return (
        props.detail &&
        <p style={{
            padding: "0.5rem",
            fontWeight: "bold",
            textAlign: "center",
            margin: "0.5rem",
            border: "1px solid black",
            borderRadius: "10px",
            backgroundColor: "#f0f0f0"
        }} className="text-info">
            {props.detail}
        </p>);
}
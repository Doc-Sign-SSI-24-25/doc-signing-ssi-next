import { MouseEventHandler } from "react";

export default function Button({
    children,
    onClick,    
    disabled,
    id,
    className = "",
    type = "button",
    style = "primary",
    outline = false,
}: Readonly<{
    children: React.ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    className?: string;
    disabled?: boolean;
    id?: string;
    type?: "button" | "submit";
    style?: "primary" | "secondary" | "dark" | "danger";
    outline?: boolean;
}>) {
    const btnStyle = outline ? `outline-${style}` : style;
    return (
        <button
            id={id}
            onClick={onClick}
            type={type}
                className={`btn btn-${btnStyle} my-3 ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
export function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="card">
            {children}
        </div>
    );
}

export function CardBody({ children }: { children: React.ReactNode }) {
    return (
        <div className="card-body">
            {children}
        </div>
    );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
    return (
        <div className="card-header">
            {children}
        </div>
    );
}

export function CardFooter({ children }: { children: React.ReactNode }) {
    return (
        <div className="card-footer">
            {children}
        </div>
    );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
    return (
        <h4 className="card-title">
            {children}
        </h4>
    );
}
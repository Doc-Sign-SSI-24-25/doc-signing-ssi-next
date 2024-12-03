export default function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" href="/">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/create_key">Create Key</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/create_certificate">Create Certificate</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/sign_document">Sign Document</a>
                    </li>
                </ul>
            </div>
            {/* <div className="container flags">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <button className="nav-link" onClick={() => { window.location.href = "/en" }}>
                            <img src="/flag_en.png" alt="EN" />
                        </button>
                    </li>
                    <li className="nav-item">
                    <button className="nav-link" onClick={() => { window.location.href = "/pt" }}>
                            <img src="/flag_br.png" alt="BR" />
                        </button>
                    </li>
                </ul>
            </div> */}

        </nav>
    );
}
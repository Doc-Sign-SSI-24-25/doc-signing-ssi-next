'use client';
import { logout } from "@docsign/services/authServices";
import { useEffect, useState } from "react";
import { getUserData } from "@docsign/services/authServices";
import If from "@docsign/app/components/if";
import { User } from "@docsign/app/@types/types";
import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();
    const doLogout = async () => {
        await logout();
        router.push('/login');
    }
    const [userData, setUserData] = useState<User | null>(null);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        setUserData(getUserData());
        setReady(true);
    }, []);
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                {ready &&
                    <If condition={(userData?.name !== '' && userData?.uid.length == 24)} then={
                        <>
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <span className="nav-link text-dark">Welcome, {userData?.name}</span>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/-/home">Home</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/-/create_key">Create Key</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/-/create_certificate">Create Certificate</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/-/create_key_and_certificate">Create Key and Certificate</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/-/sign_document">Sign Document</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/-/key_and_certificate">My Keys and Certificate</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/-/send_email">Send Email</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/-/sign_document_and_send">Sign Document and Send</a>
                                </li>
                            </ul>
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <button className="nav-link text-danger" onClick={doLogout}>Logout</button>
                                </li>
                            </ul> </>}

                        else={
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link" href="/login">Login</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/register">Register</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/validate">Validate Document</a>
                                </li>
                            </ul>
                        } />
                }
            </div>
        </nav>
    );
}
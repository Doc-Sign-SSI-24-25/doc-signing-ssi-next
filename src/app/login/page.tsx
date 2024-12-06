'use client'
import { useState } from "react";
import Input from "../components/ui/input";
import { hashPassword } from "../utils/util";
import Button from "../components/ui/button";

export default function Login() {
    const [detail, setDetail] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setDetail("");
        const form = event.currentTarget;
        const email = form.email.value;
        const password = form.password.value;
        var res = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email:email,
                password:hashPassword(password),
            }),
        }); 
        var json = await res.json();
        if (res.status === 200) {
            const data = json["data"];
            sessionStorage.setItem("token", data.uid);
            window.location.href = "/home";
        } else {
            setDetail(json.detail);
            alert(json.detail);
        } 
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="card">
                        <div className="card-header text-center">
                            <h3>Login</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <Input label="Email" type="email" id="email" placeholder="Email" />    
                                <Input label="Password" type="password" id="password" placeholder="Password" />
                                <Button type="submit" style="primary">
                                    Login
                                </Button>
                                {detail && <p>{detail}</p>}
                                <p>Don't have an account? <a href="/register">Register</a></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
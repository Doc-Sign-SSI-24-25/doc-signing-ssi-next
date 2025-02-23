'use client';
import { useState } from "react";
import Button from "../components/ui/button";
import { nameValidator, passwordValidator, emailValidator, hashPassword } from "../../utils/util";
import { API_URL } from "@docsign/config";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function onChangeName(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
    }
    function onChangeEmail(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }
    function onChangePassword(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
    }

    async function onSubmit(e : React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (!nameValidator(name) && !emailValidator(email) && !passwordValidator(password)) {
            alert("Invalid input");
            return;
        }
        var body: string = JSON.stringify({ "name": name, "email": email, "password": hashPassword(password) });
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: body,
            });
            if (response.ok) {
                alert("User registered successfully");
                window.location.href = "/login";
            } else {
                alert("Failed to register user");
            }
        } catch (error) {
            console.error("Failed to register user", error);
        }

    }
    return (
        <div className="row">
            <div className="col-md-6 offset-md-3">
                <div className="card">
                    <div className="card-header text-center">
                        <h3>Register</h3>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Enter name"
                                    value={name}
                                    onChange={onChangeName}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={onChangeEmail}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={onChangePassword}
                                />
                            </div>
                            <Button id="button" type="submit" style="dark" outline={true} onClick={onSubmit}>
                                Submit
                            </Button>
                        </form>
                        <a href="/login">Login</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
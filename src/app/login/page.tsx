'use client'
import { useState } from "react";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import { useRouter } from "next/navigation";
import { login, saveUserData } from "@docsign/services/authServices";
import Detail from "../components/ui/detail";
export default function Login() {
    const [detail, setDetail] = useState("");
    const router = useRouter();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setDetail("");
        const form = event.currentTarget;
        const email = form.email.value;
        const password = form.password.value;
        try {
            const userData = await login(email, password);
            saveUserData(userData); // Salvar os dados do usuário no cookie e o token
            router.push("/-/home");
        } catch (error: any) {
            console.error(error);
            setDetail(error.message);
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
                                <Detail detail={detail} />
                                <p>Don't have an account? <a href="/register">Register</a></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
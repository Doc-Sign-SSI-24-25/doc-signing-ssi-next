'use client';
import { useState } from "react";

export default function Page() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    function toggleInvalidInput(id: string, invalid: boolean) {
        var input = document.getElementById(id) as HTMLInputElement;
        if (invalid) {
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    }

    function changeName(event: React.ChangeEvent<HTMLInputElement>) {
        var regex = /^[a-zA-Z\s]*$/;
        var result = regex.test(event.target.value);
        if (!result) {
            toggleInvalidInput('name', true);
        } else {
            toggleInvalidInput('name', false);
        }
        setName(event.target.value);
    }

    function changeEmail(event: React.ChangeEvent<HTMLInputElement>) {
        var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        var result = regex.test(event.target.value);
        if (!result) {
            toggleInvalidInput('email', true);
        } else {
            toggleInvalidInput('email', false);
        }
        setEmail(event.target.value);
    }

    async function createKey() {
        setMessage('');
        var result = document.getElementById('result');
        // Validação básica
        if (!name || !email) {
            setMessage('Name and email are required');
            return;
        }

        try {
            var res = await fetch('http://localhost:8000/create_key', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: name, email: email })
            });

            if (!res.ok) {
                // Tenta obter o erro detalhado do servidor
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Erro ao criar chave');
            }

            const json = await res.json();

            // Cria um arquivo com a chave privada
            var file = new File([json.private_key], json.filename, { type: 'text/plain' });
            var a = document.getElementById('btn-result') as HTMLAnchorElement;
            a.href = URL.createObjectURL(file);
            a.download = json.filename;
            a.classList.remove('d-none');
        } catch (error) {
            setMessage(`${error}`);
            console.error('Error:', error);
        }
    }
    return (
        <>
            <h1>Generate Key</h1>
            <form id="form">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name="name" aria-describedby="nameHelp" value={name} onChange={changeName} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" value={email} onChange={changeEmail} />
                </div>
                <button type="button" onClick={createKey} className="btn btn-primary">Submit</button>
            </form>

            <div id="result">
                <a type="button" href="#" className="btn btn-outline-dark my-3 d-none" id="btn-result">Download Key</a>
                <p className="text-danger "> {message}</p>
            </div>
        </>
    );
}
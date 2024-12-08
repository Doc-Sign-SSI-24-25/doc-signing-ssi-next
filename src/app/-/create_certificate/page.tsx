'use client';
import { useState } from "react";
import Button from "../../components/ui/button";
import { getUserData } from "@docsign/services/userServices";

export default function CreateCertificate() {
    const [message, setMessage] = useState('');

    async function createCertificate() {
        setMessage('');

        try {
            var res = await fetch('http://localhost:8000/create_certificate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: getUserData().uid })
            });

            if (!res.ok) {
                // Tenta obter o erro detalhado do servidor
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Erro ao criar chave');
            }

            const json = await res.json();
            console.log(json);

            // Cria um arquivo com a chave privada
            var file = new File([json.data.certificate], json.data.filename, { type: 'text/plain' });
            var a = document.getElementById('btn-result') as HTMLAnchorElement;
            a.href = URL.createObjectURL(file);
            a.download = json.data.filename;
            a.classList.remove('d-none');
            setMessage(json.message);
        } catch (error) {
            setMessage(`${error}`);
            console.error('Error:', error);
        }
    }
    return (
        <>
            <h1>Generate Certificate</h1>
            <Button onClick={createCertificate}>Generate Certificate</Button>

            <div id="result">
                <a type="button" href="#" className="btn btn-outline-dark my-3 d-none" id="btn-result">Download Certificate</a>
                <p className="text-info"> {message}</p>
            </div>
        </>
    );
}
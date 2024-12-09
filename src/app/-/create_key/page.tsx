'use client';
import { useState } from "react";
import Button from "../../components/ui/button";
import { getUserData } from "@docsign/services/userServices";
import Detail from "@docsign/app/components/ui/detail";

export default function Page() {
    const [message, setMessage] = useState('');

    function toggleInvalidInput(id: string, invalid: boolean) {
        var input = document.getElementById(id) as HTMLInputElement;
        if (invalid) {
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    }


    async function createKey() {
        setMessage('');

        try {
            var res = await fetch('http://localhost:8000/create_key', {
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
            var private_key = new File([json.data.private_key], json.data.filename, { type: 'text/plain' });
            var public_key = new File([json.data.public_key], json.data.filename + '.pub', { type: 'text/plain' });
            var pr_a = document.getElementById('btn-result-private') as HTMLAnchorElement;
            var pu_a = document.getElementById('btn-result-public') as HTMLAnchorElement;
            pr_a.href = URL.createObjectURL(private_key);
            pu_a.href = URL.createObjectURL(public_key);
            pr_a.download = json.data.filename_private;
            pu_a.download = json.data.filename_public;
            pr_a.classList.remove('d-none');
            pu_a.classList.remove('d-none');
            setMessage(json.message);
        } catch (error) {
            setMessage(`${error}`);
            console.error('Error:', error);
        }
    }
    return (
        <>
            <h1>Generate Key</h1>
            <Button onClick={createKey}>Generate Key</Button>

            <div id="result">
                <a type="button" href="#" className="btn btn-outline-dark my-3 d-none" id="btn-result-private">Download Private Key</a>
                <a type="button" href="#" className="btn btn-outline-dark my-3 d-none" id="btn-result-public">Download Public Key</a>
                <Detail detail={message} /> 
            </div>
        </>
    );
}
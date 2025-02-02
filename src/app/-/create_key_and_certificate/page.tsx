'use client';
import { useState } from "react";
import Button from "@docsign/app/components/ui/button";
import Detail from "@docsign/app/components/ui/detail";
import { getUserData } from "@docsign/services/userServices";
import { API_URL } from "@docsign/config";

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
            var res = await fetch(API_URL+'/create_key_and_certificate', {
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

            // Cria um arquivo com a chave privada
            var private_key = new File([json.data.private_key], json.data.public_key_filename, { type: 'text/plain' });
            var public_key = new File([json.data.public_key], json.data.private_key_filename, { type: 'text/plain' });
            var certificate = new File([json.data.certificate], json.data.certficate_filename , { type: 'text/plain' });
            var pr_a = document.getElementById('btn-result-private') as HTMLAnchorElement;
            var pu_a = document.getElementById('btn-result-public') as HTMLAnchorElement;
            var crt_a = document.getElementById('btn-result-certificate') as HTMLAnchorElement;
            pr_a.href = URL.createObjectURL(private_key);
            pu_a.href = URL.createObjectURL(public_key);
            crt_a.href = URL.createObjectURL(certificate);
            pr_a.download = json.data.public_key_filename;
            pu_a.download = json.data.private_key_filename;
            crt_a.download = json.data.cert_filename
            pr_a.classList.remove('d-none');
            pu_a.classList.remove('d-none');
            crt_a.classList.remove('d-none');
            setMessage(json.message);
        } catch (error) {
            setMessage(`${error}`);
            console.error('Error:', error);
        }
    }
    return (
        <>
            <h1>Generate Key</h1>
            <Button onClick={createKey}>Generate Key Pairs and Certificate</Button>

            <div id="result">
                <a type="button" href="#" className="btn btn-outline-dark my-3 d-none" id="btn-result-private">Download Private Key</a>
                <a type="button" href="#" className="btn btn-outline-dark my-3 d-none" id="btn-result-public">Download Public Key</a>
                <a type="button" href="#" className="btn btn-outline-dark my-3 d-none" id="btn-result-certificate">Download Certificate</a>
                <Detail detail={message} />
            </div>
        </>

    );
}
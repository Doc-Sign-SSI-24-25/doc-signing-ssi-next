'use client';
import { useState } from "react";
import Button from "../../components/ui/button";
import { getUserData } from "@docsign/services/userServices";
import Detail from "@docsign/app/components/ui/detail";
import { API_URL } from "@docsign/config";

export default function CreateCertificate() {
    const [message, setMessage] = useState('');

    async function createCertificate() {
        setMessage('');
        try {
            const key_e = document.getElementById('private_key') as HTMLInputElement;
            if (!key_e.files || !key_e.files[0]) {
                setMessage('Private Key is required');
                throw new Error('Private Key is required');
            }
            const key = key_e.files[0];
            const formData = new FormData();
            formData.append('private_key', key);
            formData.append('user_id', getUserData().uid);

            var res = await fetch(API_URL+'/create_certificate', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                // Tenta obter o erro detalhado do servidor
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Erro ao criar chave');
            }

            const json = await res.json();

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
                <label htmlFor="private_key">Private Key:</label>
                <input type="file" id="private_key" name="private_key" accept=".pem" required />
                <a type="button" href="#" className="btn btn-outline-dark my-3 d-none" id="btn-result">Download Certificate</a>
                <Detail detail={message} />
            </div>
        </>
    );
}
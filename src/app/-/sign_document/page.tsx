'use client';
import Button from "../../components/ui/button";
import { useState } from "react";
import Input from "../../components/ui/input";
import EmailSelector from "@docsign/app/components/emailSelector";
import { ReceivedFile } from "../../@types/types";
// import SignaturePositioner from "../../components/signaturePositioner/signaturePositioner";
import If from "@docsign/app/components/if";
import { getUserData } from "@docsign/services/userServices";
import Email from "@docsign/app/components/email/email";

export default function SignDocument() {
    // if (!useAuth()) return <p>Loading...</p>;
    const [message, setMessage] = useState('');
    const [positions, setPositions] = useState([470, 840, 570, 640]); //Default values from API
    const [signedFile, setSignedFile] = useState<ReceivedFile | null>(null);
    const [showEmailSelector, setShowEmailSelector] = useState(false);

    const signDocument = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage('');

        try {
            var form = event.currentTarget as HTMLFormElement;
            const reason = form.reason.value;
            const location = form.location.value;
            const user_id = getUserData().uid;
            if (!user_id) {
                console.error('Token is required');
                alert('User token not found');
                window.location.href = '/login';
            }
            const file = form.file.files[0];

            if (!file) {
                console.error('File is required');
                throw new Error('File is required');
            }
            const formData = new FormData();
            formData.append('file', file);
            formData.append('reason', reason);
            formData.append('location', location);
            formData.append('user_id', user_id);
            if (showEmailSelector) {
                formData.append('subject', form.subject);
                formData.append('message', form.message);
                formData.append('emails', emails.join(','));
            }
            const route = showEmailSelector ? 'sign_and_send_document' : 'sign_document';
            console.log(formData);

            var res = await fetch('http://localhost:8000/' + route, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                // Tenta obter o erro detalhado do servidor
                const errorData = await res.json();
                console.error(errorData);
                if (typeof errorData.detail !== 'string') {
                    // Verifica se o erro é um array de erros
                    if (Array.isArray(errorData.detail)) {
                        //Se sim, obtem a mensagem dos erros
                        const errors = errorData.detail.map((error: any) => error.msg).join(', ');
                        console.error(errors);
                        throw new Error(errors);
                    }
                    console.error('Unknown error');
                }
                console.error(errorData.detail);
                throw new Error(errorData.detail);
            }

            const json = await res.json();

            var btn = document.getElementById('btn-result') as HTMLAnchorElement;
            btn.classList.remove('d-none');
            setMessage(json.message);
            setSignedFile({
                filename: json.data.filename,
                document:
                    `data:application/pdf;base64,${json.data.signed_document}`
            });
        } catch (error) {
            setMessage(`${error}`);
            console.error('Error:', error);
        }
    }

    const downloadFile = () => {
        if (!signedFile) {
            return;
        }
        // Decode from base64
        const base64Data = signedFile.document as string;
        // Cria um objeto Blob a partir do Base64
        const byteCharacters = atob(base64Data.split(',')[1]);
        const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        // Gera uma URL temporária para o Blob
        const blobUrl = URL.createObjectURL(blob);

        // Exibe no navegador
        window.open(blobUrl);

        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = signedFile.filename;
        a.click();
        URL.revokeObjectURL(url);
        a.remove();
    }

    const changePosition = (positions: number[]) => {
        setPositions(positions);
    }

    const [emails, setEmails] = useState<string[]>([]);
    const onSave = (email: string) => {
        setEmails([...emails, email]);
    }
    const onRemove = (index: number) => {
        setEmails(emails.filter((_, i) => i !== index));
    }
    const onEdit = (index: number, value: string) => {
        setEmails(emails.map((email, i) => i === index ? value : email));
    }

    return (
        <>
            <h1>Sign Document</h1>
            <form onSubmit={signDocument}>
                <input type="file" id="file" className="form-control my-3" name="file" accept=".pdf, .doc, .docx" />
                <Input type="text" name="reason" label="Reason" />
                <Input type="text" name="location" label="Location" />
                <div className="form-check form-switch">
                    <label htmlFor="sendEmail">Send by Email after signed: {showEmailSelector ? "Yes" : "No"}</label>
                    <input type="checkbox" className="form-check-input" name="sendEmail" id="sendEmail" role="switch" aria-checked="false" value={!showEmailSelector} onClick={() => setShowEmailSelector(!showEmailSelector)} />
                </div>
                {/* <SignaturePositioner  /> */}
                <If condition={showEmailSelector}
                    then={<>
                        <Email />
                        <EmailSelector
                            emails={emails}
                            onSave={onSave}
                            onRemove={onRemove}
                            onEdit={onEdit}
                        /></>}
                />
                <If condition={!showEmailSelector}
                    then={<Button type="submit">Sign Document</Button>}
                    else={<Button type="submit">Sign Document and Send By Email</Button>} />
            </form>

            <div id="result">
                <Button id="btn-result" onClick={downloadFile} className="d-none">Download</Button>
                <p className="text-info"> {message}</p>
            </div>
        </>
    );
}
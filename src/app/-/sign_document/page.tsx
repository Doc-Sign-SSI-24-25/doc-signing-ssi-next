'use client';
import Button from "../../components/ui/button";
import { useState } from "react";
import Input from "../../components/ui/input";
import { ReceivedFile } from "../../@types/types";
// import SignaturePositioner from "../../components/signaturePositioner/signaturePositioner";
import If from "@docsign/app/components/if";
import { getUserData } from "@docsign/services/userServices";
import Detail from "@docsign/app/components/ui/detail";
import SignaturePositioner from "@docsign/app/components/signaturePositioner/signaturePositioner";
import { API_URL } from "@docsign/config";

export default function SignDocument() {
    const [message, setMessage] = useState('');
    const [signedFile, setSignedFile] = useState<ReceivedFile | null>(null);
    const [fileHash, setFileHash] = useState<ReceivedFile | null>(null);

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
            const key = form.key.files[0];

            if (!file) {
                console.error('File is required');
                throw new Error('File is required');
            }
            if (!key) {
                console.error('Key is required');
                throw new Error('Key is required');
            }
            const formData = new FormData();
            formData.append('file', file);
            formData.append('private_key', key);
            formData.append('reason', reason);
            formData.append('location', location);
            formData.append('user_id', user_id);

            const route = 'sign_document';
            console.log(formData);

            var res = await fetch(API_URL + '/'+route, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error(errorData);
                if (typeof errorData.detail !== 'string') {
                    if (Array.isArray(errorData.detail)) {
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
            setFileHash({
                filename: `${json.data.filename}.sha256`,
                document: json.data.hash
            });
        } catch (error) {
            setMessage(`${error}`);
            console.error('Error:', error);
        }
    }

    const downloadFile = () => {
        if (!signedFile || !fileHash) {
            return;
        }
        const base64Data = signedFile.document as string;
        const byteCharacters = atob(base64Data.split(',')[1]);
        const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        const blobUrl = URL.createObjectURL(blob);
        const hashBlob = new Blob([fileHash?.document], { type: "text/plain" });
        const hashBlobUrl = URL.createObjectURL(hashBlob);

        window.open(blobUrl);

        var url = URL.createObjectURL(blob);
        var urlHash = URL.createObjectURL(hashBlob);
        var a = document.createElement('a');
        var aHash = document.createElement('a');
        a.href = url;
        aHash.href = urlHash;
        a.download = signedFile.filename;
        aHash.download = fileHash.filename;
        a.click();
        aHash.click();
        URL.revokeObjectURL(url);
        URL.revokeObjectURL(urlHash);
        a.remove();
        aHash.remove();
    }

    return (
        <>
            <h1>Sign Document</h1>
            <form onSubmit={signDocument}>
                <label htmlFor="file">File</label>
                <input type="file" id="file" className="form-control my-3" name="file" accept=".pdf, .doc, .docx" />
                <label htmlFor="key">Private Key</label>
                <input type="file" id="key" className="form-control my-3" name="key" accept=".pem" />
                <Input type="text" name="reason" label="Reason" />
                <Input type="text" name="location" label="Location" />
                <Button type="submit">Sign Document</Button>
            </form>

            <div id="result">
                <Button id="btn-result" onClick={downloadFile} className="d-none">Download</Button>
                <Detail detail={message} />
            </div>
        </>
    );
}

'use client';

import { useState } from "react";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";
import EmailSelector from "@docsign/app/components/emailSelector";
import Detail from "@docsign/app/components/ui/detail";
import { getUserData } from "@docsign/services/userServices";
import { API_URL } from "@docsign/config";

export default function SignDocumentAndSend() {
    const [emails, setEmails] = useState<string[]>([]);
    const [subject, setSubject] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [reason, setReason] = useState('');
    const [location, setLocation] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);
    const [positions, setPositions] = useState<string>(''); // Exemplo: "[470, 840, 570, 640]"
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const signAndSend = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage('');

        // Validação de entrada
        if (!attachment) {
            alert('Please select a file to sign and send.');
            return;
        }
        if (!emails.length) {
            alert('Please add at least one recipient email.');
            return;
        }
        if (!reason.trim() || !location.trim() || !subject.trim() || !emailMessage.trim()) {
            alert('All fields are required.');
            return;
        }

        try {
            setIsLoading(true);

            const user_id = getUserData().uid; // Obtém o user_id do localStorage ou similar
            if (!user_id) {
                console.error('User ID is required');
                throw new Error('User ID not found');
            }

            const formData = new FormData();
            formData.append('file', attachment);
            formData.append('user_id', user_id);
            formData.append('reason', reason);
            formData.append('location', location);
            formData.append('subject', subject);
            formData.append('message', emailMessage);
            formData.append('emails', emails.join(','));
            if (positions.trim()) {
                formData.append('positions', positions);
            }

            const res = await fetch(API_URL+'/sign_document_and_send', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error(errorData);
                throw new Error(errorData.detail || 'An unknown error occurred');
            }

            const json = await res.json();
            setMessage(json.message);

            // Reset do formulário
            setEmails([]);
            setSubject('');
            setEmailMessage('');
            setReason('');
            setLocation('');
            setAttachment(null);
            setPositions('');
        } catch (error) {
            setMessage(`${error}`);
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSave = (email: string) => setEmails([...emails, email]);
    const onRemove = (index: number) => setEmails(emails.filter((_, i) => i !== index));
    const onEdit = (index: number, value: string) =>
        setEmails(emails.map((email, i) => (i === index ? value : email)));

    return (
        <>
            <h1>Sign Document and Send</h1>
            <form onSubmit={signAndSend}>
                <input
                    type="file"
                    onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
                    className="form-control my-3"
                    accept=".pdf,.doc,.docx"
                />
                {attachment && <p>Selected file: {attachment.name}</p>}
                <Input
                    type="text"
                    label="Reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
                <Input
                    type="text"
                    label="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <Input
                    type="text"
                    label="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
                <Input
                    type="textarea"
                    label="Message"
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                />
                <Input
                    type="text"
                    label="Signature Positions (JSON format)"
                    value={positions}
                    onChange={(e) => setPositions(e.target.value)}
                />
                <EmailSelector
                    emails={emails}
                    onSave={onSave}
                    onRemove={onRemove}
                    onEdit={onEdit}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Signing and Sending...' : 'Sign and Send'}
                </Button>
            </form>

            <div id="result">
                {isLoading && <p>Processing, please wait...</p>}
                <Detail detail={message} />
            </div>
        </>
    );
}

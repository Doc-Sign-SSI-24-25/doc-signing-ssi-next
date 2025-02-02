'use client';

import { useState } from "react";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";
import EmailSelector from "@docsign/app/components/emailSelector";
import Detail from "@docsign/app/components/ui/detail";
import { getUserData } from "@docsign/services/userServices";
import { API_URL } from "@docsign/config";

export default function SendEmail() {
    const [emails, setEmails] = useState<string[]>([]);
    const [subject, setSubject] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const sendEmail = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage('');

        // Validação de entrada
        if (!emails.length) {
            alert('Please add at least one email.');
            return;
        }
        if (!subject.trim() || !emailMessage.trim()) {
            alert('Subject and message cannot be empty.');
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
            formData.append('user_id', user_id);
            formData.append('subject', subject);
            formData.append('message', emailMessage);
            formData.append('emails', emails.join(','));
            if (attachment) {
                formData.append('attachment', attachment);
            }

            const res = await fetch(`${API_URL}/send_email`, {
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
            setAttachment(null);
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
            <h1>Send Email</h1>
            <form onSubmit={sendEmail}>
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
                <input
                    type="file"
                    onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
                    className="form-control my-3"
                />
                {attachment && <p>Selected file: {attachment.name}</p>}
                <EmailSelector
                    emails={emails}
                    onSave={onSave}
                    onRemove={onRemove}
                    onEdit={onEdit}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send Email'}
                </Button>
            </form>

            <div id="result">
                {isLoading && <p>Sending email, please wait...</p>}
                <Detail detail={message} />
            </div>
        </>
    );
}

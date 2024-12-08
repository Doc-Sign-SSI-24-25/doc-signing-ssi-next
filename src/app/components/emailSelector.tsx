'use client';
import { useState } from "react";
import Button from "./ui/button";
import Input from "./ui/input";
import If from "@docsign/app/components/if";
/**
 * Componente para selecionar os emails dos destinatários

 * @param props 
 */
export default function EmailSelector(props: {
    /**
     * Emails pré-carregados
     */
    emails: string[];
    /**
     * Função que altera um email já existente na lista
     * @param index 
     * @param value 
     */
    onEdit: (index: number, value: string) => void;
    /**
     * Função para salvar os emails
     */
    onSave: (emails: string) => void;
    /**
     * Função para remover um email
     */
    onRemove: (index: number) => void;

}) {
    const [email, setEmail] = useState('');
    const [editing, setEditing] = useState(-1);

    const _emailRow = (email: string, index: number) => {

        return (
            <div key={index}>
                <Input style={{ width: '75%' }} label="E-mail:" type="email"
                    readOnly={editing !== index}
                    disabled={editing !== index}
                    value={email} onChange={(e: { target: { value: string; }; }) => props.onEdit(index, e.target.value)} />
                <Button style="secondary" onClick={() => {
                    if (editing === index) {
                        setEditing(-1);
                    } else {
                        setEditing(index);
                    }
                }}>
                    <If condition={editing === index} then="Salvar" else="Editar" />
                </Button>
                <Button style="danger" outline={true} onClick={() => props.onRemove(index)}>Remover</Button>
            </div>
        );
    }

    return (
        <div>
            <h2>Emails</h2>
            <Input type="email" style={{ width: '75%' }} placeholder="Email" value={email} onChange={(e: any) => setEmail(e.target.value)} />
            <Button outline={true} style="primary" onClick={() => { setEmail(""); props.onSave(email) }}>Adicionar</Button>
            {props.emails.map((email, index) => _emailRow(email, index))}
        </div>
    );
}
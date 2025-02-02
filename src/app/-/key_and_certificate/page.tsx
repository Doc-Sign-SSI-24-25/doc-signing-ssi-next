'use client'
import { getUserData } from '@docsign/services/userServices';
import Button from '../../components/ui/button';
import styles from './page.module.css'
import { useEffect, useState } from "react";
import { API_URL } from '@docsign/config';

type ReceivedFile = {
    filename: string;
    data: any;
}

export default function KeyAndCertificate() {
    const [publicKey, setPublicKey] = useState<ReceivedFile>({ filename: '', data: null });
    const [certificate, setCertificate] = useState<ReceivedFile>({ filename: '', data: null });
    const getKey = async () => {
        var res = await fetch(`${API_URL}/get_keys?user_id=${getUserData().uid}`);
        var json = await res.json();
        if (res.status === 200) {
            var data = json.data;
            setPublicKey({ filename: data.public_key_filename, data: data.public_key });
        } else {
            alert(json.detail);
        }
    }

    const getCertificate = async () => {
        var res = await fetch(`${API_URL}/get_certificate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "user_id": getUserData().uid
            }),
        });
        var json = await res.json();
        if (res.status === 200) {
            var data = json.data;
            setCertificate({ filename: data.certificate_filename, data: data.certificate });
        } else {
            alert(json.detail);
        }
    }

    const downloadFile = (file: ReceivedFile) => {
        var _file = new File([file.data], file.filename, { type: 'text/plain' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(_file);
        a.download = file.filename;
        a.click();
        a.remove();
    }


    useEffect(() => {
        getKey();
        getCertificate();
    }, []);

    return (
        <div className="d-flex justify-content-around gap-2">
            <div className="card">
                <div className="card-header text-center">
                    <p className="h3">Keys</p>

                </div>
                <div className="card-body">
                    {publicKey.data ?
                        <Button onClick={() => downloadFile(publicKey)}
                            className="btn btn-primary mx-3">
                            Download Public Key</Button> :
                        <p>No public key found</p>
                    }
                </div>
            </div>
            <div className={styles.key}>

            </div>
            <div className="card">
                <div className="card-header text-center">
                    <p className="h3">Certificate</p>

                </div>
                <div className="card-body">
                    {certificate.data && certificate.data ?
                        <Button onClick={() => downloadFile(certificate)}
                            className="btn btn-primary mx-3">
                            Download Certificate</Button> :
                        "No Certificate found"}
                </div>
            </div>
        </div>
    );
}
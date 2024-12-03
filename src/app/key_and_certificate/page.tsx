'use client'
import styles from './page.module.css'
import { useEffect, useState } from "react";
export default function KeyAndCertificate() {
    const [key, setKey] = useState({ "filename": null, "data": null });
    const [certificate, setCertificate] = useState({ "filename": null, "data": null });
    const getKey = async () => {
        var user_id = sessionStorage.getItem("token");
        console.log(user_id);
        var res = await fetch("http://localhost:8000/get_key", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "user_id": sessionStorage.getItem("token"),
            }),
        });
        var json = await res.json();
        if (res.status === 200) {
            setKey(json);
        } else {
            alert(json.detail);
        }
    }

    const getCertificate = async () => {
        var res = await fetch("http://localhost:8000/get_certificate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "user_id": sessionStorage.getItem("token"),
            }),
        });
        var json = await res.json();
        if (res.status === 200) {
            setCertificate(json);
        } else {
            alert(json.detail);
        }
    }

    useEffect(() => {
        getKey();
        // getCertificate();
    }, []);

    return (
        <div className="d-flex justify-content-around gap-2">
            <div className="card">
                <div className="card-header text-center">
                    <p className="h3">Key</p>

                </div>
                <div className="card-body">
                    {key.data ?
                        <a href='#' download={key.filename} className="btn btn-primary">Download</a> :
                        "No key found"
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
                    {key.data && certificate.data ?
                        <a href='#' download="key_and_certificate.zip" className="btn btn-primary">Download</a> :
                        "No Certificate found"}
                </div>
            </div>
        </div>
    );
}
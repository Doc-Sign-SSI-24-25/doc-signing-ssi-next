'use client';
import { useState } from "react";
import Button from "../components/ui/button"
import Detail from "../components/ui/detail";
import { API_URL } from "@docsign/config";
import { ApiResponse } from "../@types/types";
import If from "../components/if";

enum Status {
    PENDING = "PENDING",
    VALID = "VALID",
    INVALID = "INVALID"
}

export default function Page() {
    const [detail, setDetail] = useState("");
    const [isValid, setIsValid] = useState<Status>(Status.PENDING);
    const [result, setResult] = useState<any>(null);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsValid(Status.PENDING);
        setDetail("");
        const form = event.currentTarget;
        const file = form.file.files[0];
        if (!file) {
            setDetail("Select a file");
            return;
        }
        const formData = new FormData();
        formData.append("file_content", file);
        try {
            const response = await fetch(`${API_URL}/validate`, {
                method: "POST",
                body: formData
            });
            if (response.ok) {
                const data: ApiResponse = await response.json();
                if (!data.data.validated || !data.data.signatures) {
                    console.log(data);
                    var error = "";
                    try {
                        error = data.data.error;
                    } catch (e) {
                        error = data.message;
                    }
                    setDetail(error);
                    setIsValid(Status.INVALID);
                    console.log(detail);
                    return;
                }
                setDetail(data.message);
                setResult(data.data);
                setIsValid(Status.VALID);
            } else {
                const data: ApiResponse = await response.json();
                var error = "";
                try {
                    error = data.data.error;
                } catch (e) {
                    error = "The file has no signature";
                }
                setDetail(error);
                setIsValid(Status.INVALID);
                return;
            }
        } catch (error: any) {
            console.error(error);
            setDetail(error.message);
            setIsValid(Status.PENDING);
        }   
    }

    const resetForm = () => {
        setDetail("");
        setIsValid(Status.PENDING);
    }

    return (
        <div className="col-md-6 offset-md-3">
            <div className="card">
                <div className="card-header text-center">
                    <h3>Validate</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="file">Upload the File</label>
                        <input type="file" className="form-control" id="file" name="file" accept=".pdf" />
                        <Button type="submit" style="primary">
                            Send
                        </Button>
                        <Button type="reset" style="secondary" onClick={resetForm}>
                            Clear
                        </Button>
                        {isValid === Status.PENDING && <Detail detail={detail} />}
                    </form>
                    <hr className="w-100" />
                    <div className="text-center">
                        <If condition={isValid === Status.VALID} then={
                            <div>
                                <h4 className="text-success">The document is valid</h4>
                                <p>{detail}</p>
                                <hr />
                                <h5>Signature:</h5>
                                <p>Signer: {result?.signatures.name}</p>
                                <p>Reason: {result?.signatures.reason}</p>
                                <p>Location: {result?.signatures.location}</p>
                                <p>Date: {result?.signatures.data}</p>
                            </div>
                        } />
                        <If condition={isValid === Status.INVALID} then={
                            <div>
                                <h4 className="text-danger">The document is invalid or has no signature</h4>
                                <p>{detail}</p>
                            </div>
                        } />
                    </div>
                </div>
            </div>
        </div>
    );
}
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
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setDetail("");
        const form = event.currentTarget;
        const file = form.file.files[0];
        if (!file) {
            setDetail("Select a file");
            return;
        }
        const hash = form.hash.files[0];
        if (!hash) {
            setDetail("Select a hash");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await fetch(`${API_URL}/validate`, {
                method: "POST",
                body: formData
            });
            if (response.ok) {
                const data: ApiResponse = await response.json();
                setDetail(data.message);
            } else {
                setDetail("Error validating the file");
            }
        } catch (error: any) {
            console.error(error);
            setDetail(error.message);
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
                        <label htmlFor="hash">Upload the Hash associated to the file</label>
                        <input type="file" className="form-control" id="hash" name="hash" accept=".txt,.sha256" />
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
                                <h4 className="text-success">The file matches the hash</h4>
                                <p>{detail}</p>
                            </div>
                        } />
                        <If condition={isValid === Status.INVALID} then={
                            <div>
                                <h4 className="text-danger">The file does not match the hash</h4>
                                <p>{detail}</p>
                            </div>
                        } />
                    </div>
                </div>
            </div>
        </div>
    );
}
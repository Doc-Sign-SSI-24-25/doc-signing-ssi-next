import { createHash as cryptoCreateHash } from 'crypto';

function nameValidator(name: string): boolean {
    return /^[a-zA-Z\s]*$/.test(name);
}

function emailValidator(email: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

function passwordValidator(password: string): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
}

function hashPassword(password: string): string {
    return createHash("sha256").update(password).digest("hex");
}
function createHash(algorithm: string) {
    return cryptoCreateHash(algorithm);
}

export { nameValidator, emailValidator, passwordValidator, hashPassword };


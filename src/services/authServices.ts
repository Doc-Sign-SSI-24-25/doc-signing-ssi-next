
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { API_URL } from "../config";
import { hashPassword } from "../utils/util";
import { ApiResponse, User } from "@docsign/app/@types/types";

export const login = async (email: string, password: string): Promise<string> => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: hashPassword(password) }),
    });
    // Certifique-se de que a API retorna o token.
    const json: ApiResponse = await response.json();
    const data = json.data;
    if (data === null || data === undefined) {
        throw new Error(json.message);
    }
    return data;
};

export const logout = async () => {
    destroyCookie(null, "userData", {path: "/"});
    destroyCookie(null, "authToken" , {path: "/"});
};

export const saveUserData = (data: any) => {
    setCookie(null, "userData", JSON.stringify(data), {
        maxAge: 1800, // 30 minutos
        path: "/",
    });
    setCookie(null, "authToken", data.uid, {
        maxAge: 1800, // 30 minutos
        path: "/",
    });
};

// Salvar token no cookie
export const saveToken = (token: string) => {
    setCookie(null, "authToken", token, {
        maxAge: 1800, // 30 minutos
        path: "/",
    });
};

// Obter token do cookie
export const getToken = () => {
    const cookies = parseCookies();
    console.log(cookies);
    if (!cookies.authToken) {
        return null;
    }
    return cookies.authToken;
};

// Remover token
export const removeToken = () => {
    destroyCookie(null, "authToken", {path: "/"});
};

// Verificar se o token é válido
// Alterar para verificar se o token é um token JWT válido
export const isValidToken = (ctx?: any): boolean => {
    let token: string | null;

    // Verifica se está no servidor ou no cliente
    if (typeof window === "undefined") {
        // No servidor, use o contexto
        const cookies = parseCookies(ctx);
        token = cookies.authToken || null;
        if (!token) {
            token = ctx.token || null;
        }
    } else {
        // No cliente
        const cookies = parseCookies();
        token = cookies.authToken || null;
    }
    if (!token || typeof token !== "string") {
        return false;
    }
    return token.length === 24;
};

export const getTokenServer = (req: any) => {
    const cookies = parseCookies({ req });
    if (!cookies.authToken) {
        return null;
    }
    return cookies.authToken;
};

export const getUserData = (ctx?: any): User | null => {
    let userData: any;
    if (typeof window === "undefined") {
        const cookies = parseCookies(ctx);
        userData = cookies.userData || null;
        if (!userData) {
            userData = ctx.userData || null;
        }
    } else {
        const cookies = parseCookies();
        userData = cookies.userData || null;
    }
    if (!userData) {
        return null;
    }
    try {
        const user: User = JSON.parse(userData);
        return user;
    } catch (error) {
        console.error("Error parsing user data", error);
        return null;
    }    
};
import { parseCookies } from 'nookies';
import { API_URL } from '../config';
import { User } from '@docsign/app/@types/types';

async function doLogin(email: string, pwHash: string): Promise<{ email: string, pwHash: string }> {
    const res = await fetch(`${API_URL}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pwHash }),
    });
    if (res.status !== 200) {
        throw new Error('Invalid credentials');
    }
    const json = await res.json();
    /*
    API return format: 
    {
    "message": <string>,
    "data": {
        "uid": <string>,
        "name": <string>,
        "token": <string>
        }
    }
    */
    return json.data;
}

    function getUserData(): User {
    const cookies = parseCookies();
    if (!cookies.userData) {
        return { uid: '', name: ''};
    }
    const json = JSON.parse(cookies.userData);
    return json;
}

export { doLogin, getUserData };
import { jwtDecode } from "jwt-decode";

export async function authenticateUser(email, password) {
    if(email === null || email.trim() === "" || password === null || password === "") {
        throw new Error("All Fields must be filled");
    }

    //dummy error
    throw new Error("Invalid user email and password");

    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    //     method: 'POST',
    //     body: JSON.stringify({"userName": user, "password": password}),
    //     headers: {
    //         'content-type': 'application/json',
    //     },
    // });

    // const data = await res.json();

    // if(res.status === 200) {
    //     setToken(data.token);
    //     return true;
    // }
    // else {
    //     throw new Error(data.message);
    // }
}

export async function registerUser(email, password, confirmPassword) {
    if(email === null || email.trim() === "" || password === null || password === "" || confirmPassword === null || confirmPassword === "") {
        throw new Error("All Fields must be filled");
    }

    const res = await fetch("https://travelwise-server.onrender.com/signup", {
        method: 'POST',
        body: JSON.stringify({"email":email, "password":password, "confirmPassword":confirmPassword}),
        headers: {
            'content-type': 'application/json',
        },
    });

    const data = await res.json();

    if(res.status === 201) {
        return true;
    }
    else {
        throw new Error(data.message);
    }
}

function setToken(token) {
    localStorage.setItem('access_token', token);
}

export function getToken() {
    try {
        return localStorage.getItem('access_token');
    }
    catch(err) {
        return null;
    }
}

export function removeToken() {
    localStorage.removeItem('access_token');
}

export function readToken() {
    try {
        const token = getToken();
        return token ? jwtDecode(token) : null;
    }
    catch(err) {
        return null;
    }
}

export function isAuthenticated() {
    const token = readToken();
    return token ? true : false;
}
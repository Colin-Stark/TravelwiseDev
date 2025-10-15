import { use } from "react";
import { getToken } from "./authenticate";
import { getUserCookie } from "./cookies";

// export async function addToFavourites(id) {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`, {
//         method: 'PUT',
//         headers: {
//             'content-type': 'application/json',
//             'Authorization': `JWT ${getToken()}`,
//         },
//     });

//     if(res.status === 200) {
//         return res.json();
//     }
//     else {
//         return [];
//     }
// }

// export async function removeFromFavourites(id) {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`, {
//         method: 'DELETE',
//         headers: {
//             'content-type': 'application/json',
//             'Authorization': `JWT ${getToken()}`,
//         },
//     });

//     if(res.status === 200) {
//         return res.json();
//     }
//     else {
//         return [];
//     }
// }

// export async function getFavourites() {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites`, {
//         method: 'GET',
//         headers: {
//             'content-type': 'application/json',
//             'Authorization': `JWT ${getToken()}`,
//         },
//     });

//     if(res.status === 200) {
//         return res.json();
//     }
//     else {
//         return [];
//     }
// }

export async function getUser() {
    // const res = await fetch('', {
    //     method: 'GET',
    //     headers: {
    //         'content-type': 'application/json',
    //         'Authorization': `JWT ${getToken()}`,
    //     },
    // });

    // if(res.status === 200) {
    //     return res.json();
    // }
    // else {
    //     return [];
    // }

    const userCookie = await getUserCookie()
     
    try {
        const res = await fetch("/api/user", {  // Changed to same-origin API route
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                email: userCookie?.email,
            }),
        });

        const data = await res.json();
        if (!res.ok) {
            // Try to parse error message from server
            let errorMsg = "Invalid user data";
            try {
                errorMsg = data.message || errorMsg;
            } catch (e) { }
            //setWarning(errorMsg);
            return;
        }

        //get user data
        return data.user;

    } catch (err) {
        //setWarning("Network error: " + err.message);
    }

    return null;
}

export async function getLanguage() {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history`, {
    //     method: 'GET',
    //     headers: {
    //         'content-type': 'application/json',
    //         'Authorization': `JWT ${getToken()}`,
    //     },
    // });

    // if(res.status === 200) {
    //     return res.json();
    // }
    // else {
    //     return [];
    // }

    //dummy code
    return "EN";
}
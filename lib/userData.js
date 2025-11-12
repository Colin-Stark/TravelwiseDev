import { use } from "react";
import { getToken } from "./authenticate";
import { getUserCookie } from "./cookies";
import moment from "moment";

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

export async function getUserFlights(userId) {
    var flights = [];
    // try {
    //     const res = await fetch("/api/get-user-flights", {  // Changed to same-origin API route
    //         method: 'POST',
    //         headers: {
    //             'content-type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             id: userId,
    //         }),
    //     });

    //     const data = await res.json();
    //     if (!res.ok) {
    //         // Try to parse error message from server
    //         let errorMsg = "Invalid user data";
    //         try {
    //             errorMsg = data.message || errorMsg;
    //         } catch (e) { }
    //         //setWarning(errorMsg);
    //         return;
    //     }

    //     //get user data
    //     return data.user;

    // } catch (err) {
    //     //setWarning("Network error: " + err.message);
    // }

    flights = [
        {
            arrival_country: "France",
            arrival_city: "Paris",
            outbound_date: "2025-12-10",
            return_date: "2025-12-14",
            departure_token: "WyJDalJJY20wMGNXaGZaRzh0UTBsQlFWOXRVbEZDUnkwdExTMHRMUzB0TFhCcWEyc3hORUZCUVVGQlIycHNkRVE0UkZNMmRDMUJFZ3hWUVRnNE9YeFZRVEl6TXpJYUN3aVYxd29RQWhvRFZWTkVPQnh3bGRjSyIsW1siUEVLIiwiMjAyNS0xMC0wOCIsIlNGTyIsbnVsbCwiVUEiLCI4ODkiXSxbIlNGTyIsIjIwMjUtMTAtMDgiLCJBVVMiLG51bGwsIlVBIiwiMjMzMiJdXV0=",
        },
        {
            arrival_country: "Canada",
            arrival_city: "Vancouver",
            outbound_date: "2025-08-01",
            return_date: "2025-08-04",
            departure_token: "asdfghjkl",
        },
        {
            arrival_country: "Japan",
            arrival_city: "Tokyo",
            outbound_date: "2025-11-25",
            return_date: "2025-11-29",
            departure_token: "WyJDalJJY20wMGNXaGZaRzh0UTBsQlFWOXRVbEZDUnkwdExTMHRMUzB0TFhCcWEyc3hORUZCUVVGQlIycHNkRVE0UkZNMmRDMUJFZ3hWUVRnNE9YeFZRVEl6TXpJYUN3aVYxd29RQWhvRFZWTkVPQnh3bGRjSyIsW1siUEVLIiwiMjAyNS0xMC0wOCIsIlNGTyIsbnVsbCwiVUEiLCI4ODkiXSxbIlNGTyIsIjIwMjUtMTAtMDgiLCJBVVMiLG51bGwsIlVBIiwiMjMzMiJdXV1=",
        }
    ];

    const dateNow = moment();
    var filteredFlights = [];
    for(const flight of flights) {
        if(dateNow.isAfter(moment(flight.return_date))) {
            continue;
        }

        filteredFlights.push(flight);
    }
    return filteredFlights;

    return null;
}
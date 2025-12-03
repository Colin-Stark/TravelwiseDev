import { use } from "react";
import { getToken } from "./authenticate";
import { getUserCookie } from "./cookies";
import moment from "moment";
import { formatUTCDate } from "./airportData";

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

export async function updateUser(properties) {     
    try {
        const res = await fetch("/api/update-user", {  // Changed to same-origin API route
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(properties),
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
        return data;

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

export async function addUserFlight(properties) {
    try {
        const res = await fetch("/api/search/add-user-flight", {  // Changed to same-origin API route
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(properties),
        });

        const data = await res.json();
        if (!res.ok) {
            // Try to parse error message from server
            let errorMsg = "Invalid flight data";
            try {
                errorMsg = data.message || errorMsg;
            } catch (e) { }
            console.error(errorMsg);
            return false;
        }

        return data;

    } catch (err) {
        console.error("Network error: " + err.message);
    }

    return false;
}


export async function getUserFlights(email) {
    var flights = [];
    try {
        const res = await fetch("/api/search/get-user-flights", {  // Changed to same-origin API route
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
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
            return [];
        }

        //get user data
        flights = data.data;

    } catch (err) {
        return [];
        //setWarning("Network error: " + err.message);
    }

    // flights = [
    //     {
    //         arrival_country: "France",
    //         arrival_city: "Paris",
    //         outbound_date: "2025-12-10",
    //         return_date: "2025-12-14",
    //         departure_token: "WyJDalJJY20wMGNXaGZaRzh0UTBsQlFWOXRVbEZDUnkwdExTMHRMUzB0TFhCcWEyc3hORUZCUVVGQlIycHNkRVE0UkZNMmRDMUJFZ3hWUVRnNE9YeFZRVEl6TXpJYUN3aVYxd29RQWhvRFZWTkVPQnh3bGRjSyIsW1siUEVLIiwiMjAyNS0xMC0wOCIsIlNGTyIsbnVsbCwiVUEiLCI4ODkiXSxbIlNGTyIsIjIwMjUtMTAtMDgiLCJBVVMiLG51bGwsIlVBIiwiMjMzMiJdXV0=",
    //     },
    //     {
    //         arrival_country: "Canada",
    //         arrival_city: "Vancouver",
    //         outbound_date: "2025-08-01",
    //         return_date: "2025-08-04",
    //         departure_token: "asdfghjkl",
    //     },
    //     {
    //         arrival_country: "Japan",
    //         arrival_city: "Tokyo",
    //         outbound_date: "2025-11-25",
    //         return_date: "2025-11-29",
    //         departure_token: "WyJDalJJY20wMGNXaGZaRzh0UTBsQlFWOXRVbEZDUnkwdExTMHRMUzB0TFhCcWEyc3hORUZCUVVGQlIycHNkRVE0UkZNMmRDMUJFZ3hWUVRnNE9YeFZRVEl6TXpJYUN3aVYxd29RQWhvRFZWTkVPQnh3bGRjSyIsW1siUEVLIiwiMjAyNS0xMC0wOCIsIlNGTyIsbnVsbCwiVUEiLCI4ODkiXSxbIlNGTyIsIjIwMjUtMTAtMDgiLCJBVVMiLG51bGwsIlVBIiwiMjMzMiJdXV1=",
    //     }
    // ];

    const dateNow = moment();
    var filteredFlights = [];
    for(const flight of flights) {
        if(dateNow.isAfter(moment(formatUTCDate(flight.return_date)))) {
            continue;
        }

        filteredFlights.push(flight);
    }
    return filteredFlights;

    return null;
}

export async function addUserHotel(properties) {
    try {
        const res = await fetch("/api/search/add-user-hotel", {  // Changed to same-origin API route
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(properties),
        });

        const data = await res.json();
        if (!res.ok) {
            // Try to parse error message from server
            let errorMsg = "Invalid hotel data";
            try {
                errorMsg = data.message || errorMsg;
            } catch (e) { }
            console.error(errorMsg);
            return false;
        }

        return data;

    } catch (err) {
        console.error("Network error: " + err.message);
    }

    return false;
}

export async function getUserHotels(email) {
    var hotels = [];
    try {
        const res = await fetch("/api/search/get-user-hotels", {  // Changed to same-origin API route
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
            }),
        });

        const data = await res.json();
        if (!res.ok) {
            // Try to parse error message from server
            let errorMsg = "Invalid hotel data";
            try {
                errorMsg = data.message || errorMsg;
            } catch (e) { }
            //setWarning(errorMsg);
            return;
        }

        //get user data
        hotels = data.data;

    } catch (err) {
        //setWarning("Network error: " + err.message);
    }

    // hotels = [
    //     {
    //         name: "Best Western Hôtel Rives de Paris La Défense",
    //         check_in_date: "2025-12-10",
    //         check_out_date: "2025-12-14",
    //         property_token: "ChoI7I7dwpH68_zKARoNL2cvMTFiN3J4azV6OBAB",
    //         price: 109,
    //     },
    //     {
    //         name: "Courtyard by Marriott Toronto Northeast/Markham",
    //         check_in_date: "2025-08-10",
    //         check_out_date: "2025-08-14",
    //         property_token: "ChgIjbGa-_2G-7xBGgwvZy8xcTY5cDJ3X3AQAQ",
    //         price: 125,
    //     },
    //     {
    //         name: "HOTEL GRAPHY NEZU",
    //         check_in_date: "2025-11-25",
    //         check_out_date: "2025-11-29",
    //         property_token: "ChgI4MyEhJ_t7sJgGgwvZy8xMnFnanR5aG4QAQ",
    //         price: 148,
    //     }
    // ];

    const dateNow = moment();
    var filteredHotels = [];
    for(const hotel of hotels) {
        if(dateNow.isAfter(moment(formatUTCDate(hotel.check_out_date)))) {
            continue;
        }

        filteredHotels.push(hotel);
    }
    console.log(filteredHotels)
    return filteredHotels;

    return null;
}
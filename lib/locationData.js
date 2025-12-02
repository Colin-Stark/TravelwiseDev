import moment from "moment";

export async function getLocation(place_id) {
    var tmpLoc = null;

    // try {
    //     const res = await fetch("/api/itinerary/get-location", {
    //         method: 'POST',
    //         headers: {
    //             'content-type': 'application/json',
    //         },
    //         body: {
    //              place_id: place_id
    //          },
    //     });

    //     const data = await res.json();
    //     if (!res.ok) {
    //         let errorMsg = "Invalid location properties";
    //         try {
    //             errorMsg = data.message || errorMsg;
    //         } catch (e) { }
    //         console.error(errorMsg);
    //         return arr;
    //     }

    //     arr = data;
    // } catch (err) {
    //     console.error("Network error: " + err.message);
    //     return arr;
    // }

    var arr = [];
    try {
        // Use the relative path to the CSV file in the public folder
        const response = await fetch('/data/locations_test.json'); 

        arr = await response.json();

    } catch (error) {
        console.error("Error fetching JSON file:", error);
    }
    for(const loc of arr["local_results"]) {
        if(loc.place_id === place_id) {
            tmpLoc = loc;
        }
    }

    return tmpLoc;
}

export async function getLocationList(properties) {
    var arr = [];

    try {
        const res = await fetch("/api/itinerary/get-locations", {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(properties),
        });

        const data = await res.json();
        if (!res.ok) {
            let errorMsg = "Invalid location properties";
            try {
                errorMsg = data.message || errorMsg;
            } catch (e) { }
            console.error(errorMsg);
            return arr;
        }

        arr = data;
    } catch (err) {
        console.error("Network error: " + err.message);
        return arr;
    }

    // try {
    //     // Use the relative path to the CSV file in the public folder
    //     const response = await fetch('/data/locations_test.json'); 

    //     arr = await response.json();

    // } catch (error) {
    //     console.error("Error fetching JSON file:", error);
    // }

    return arr["local_results"];
}

export async function getLocationPhotos(properties) {
    var arr = [];

    try {
        const res = await fetch("/api/itinerary/get-location-photos", {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(properties),
        });

        const data = await res.json();
        if (!res.ok) {
            let errorMsg = "Invalid location properties";
            try {
                errorMsg = data.message || errorMsg;
            } catch (e) { }
            console.error(errorMsg);
            return arr;
        }

        arr = data;
    } catch (err) {
        console.error("Network error: " + err.message);
        return arr;
    }

    return arr["images_results"];
}

export async function getDirections(properties) {
    var arr = [];

    try {
        const res = await fetch("/api/itinerary/get-directions", {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(properties),
        });

        const data = await res.json();
        if (!res.ok) {
            let errorMsg = "Invalid location properties";
            try {
                errorMsg = data.message || errorMsg;
            } catch (e) { }
            console.error(errorMsg);
            return arr;
        }

        arr = data;
    } catch (err) {
        console.error("Network error: " + err.message);
        return arr;
    }

    return arr;
}

export async function getUpcomingLocation(itinerary) {
    if(!itinerary || !itinerary.schedules) {
        return null;
    }

    var selectedLoc = null;
    const datetimeNow = moment();
    for(const schedule of itinerary.schedules) {
        const day = moment(`${schedule.day} 11:59 PM`);

        if(datetimeNow.isAfter(day)) {
            continue;
        }

        if(!schedule.locations || schedule.locations.length <= 0) {
            break;
        }

        for(const location of schedule.locations) {
            const time = moment(`${schedule.day} ${location.time}`);
            if(datetimeNow.isBefore(time)) {
                selectedLoc = location;
                break;
            }
        }

        if(selectedLoc !== null) {
            break;
        }
    }

    return selectedLoc;
}
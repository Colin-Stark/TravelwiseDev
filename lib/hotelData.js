export async function getHotelList(properties) {
    var arr = [];
    
    // try {
    //     const res = await fetch("/api/search/hotel", {  // Changed to same-origin API route
    //         method: 'POST',
    //         headers: {
    //             'content-type': 'application/json',
    //         },
    //         body: JSON.stringify(properties),
    //     });

    //     const data = await res.json();
    //     if (!res.ok) {
    //         // Try to parse error message from server
    //         let errorMsg = "Invalid flight properties";
    //         try {
    //             errorMsg = data.message || errorMsg;
    //         } catch (e) { }
    //         //setWarning(errorMsg);
    //         return;
    //     }

    //     //get flight data

    // } catch (err) {
    //     //setWarning("Network error: " + err.message);
    // }

    try {
        // Use the relative path to the CSV file in the public folder
        const response = await fetch('/data/hotels_test.json'); 
        arr = await response.json();

        arr = arr["properties"];

    } catch (error) {
        console.error("Error fetching JSON file:", error);
    }

    if(arr?.length > 0) {
        arr = arr.filter((obj) => {
            return obj.hasOwnProperty("rate_per_night") && obj.rate_per_night.extracted_lowest >= 0;
        });

    }

    return arr;
}
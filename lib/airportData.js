import Papa from 'papaparse';

export async function fetchCountryCsv() {
    var arr = [];

    try {
        // Use the relative path to the CSV file in the public folder
        const response = await fetch('/data/countries_iso3166b.csv'); 
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csvString = decoder.decode(result.value);

        Papa.parse(csvString, {
            header: true, // If your CSV has a header row
            complete: (results) => {
                arr = results.data;
            },
            error: (error) => {
                console.error("Error parsing CSV:", error);
            }
        });
    } catch (error) {
        console.error("Error fetching CSV file:", error);
    }

    return arr;
}

export async function fetchAirportData() {
    var arr = [];

    try {
        // Use the relative path to the CSV file in the public folder
        const response = await fetch('/data/airports.json'); 
        arr = await response.json();
    } catch (error) {
        console.error("Error fetching JSON file:", error);
    }

    return arr;
}

export async function fetchCountryData() {
    var arr = [];

    try {
        // Use the relative path to the CSV file in the public folder
        const response = await fetch('/data/google-countries.json'); 
        arr = await response.json();
    } catch (error) {
        console.error("Error fetching JSON file:", error);
    }

    return arr;
}

//returns an object where the keys are the country names and the values are the iso code
export async function getCountryISO(countryData=null) {
    countryData = countryData ? countryData : await fetchCountryCsv();
    var countries = {};
    countryData.forEach((cData)=>{
        countries[cData.country_common?.toLowerCase()] = cData.iso2;
    });

    return countries;
}

export async function getCountryList(countryData=null) {
    // countryData = countryData ? countryData : await fetchCountryCsv();
    countryData = countryData ? countryData : await fetchCountryData();
    var countries = [];
    countryData.forEach((country)=>{
        if(country?.country_name) {
            countries.push(country.country_name);
        }
    });

    return countries;
}

export async function getCountryCodeObj(countryData=null) {
    countryData = countryData ? countryData : await fetchCountryData();
    var countryCodes = {};
    countryData.forEach((country)=>{
        if(country?.country_code && country?.country_name) {
            countryCodes[country.country_name] = country.country_code;
        }
    });

    return countryCodes;
}

export async function filterObjByCountry(country, currentObj=null) {
    currentObj = currentObj ? currentObj : await fetchAirportData();
    var resultObj = currentObj?.filter((obj)=>{
        return obj.Country.toLowerCase() === country.toLowerCase();
    });
        
    return resultObj;
}

export async function getCityList(country, currentObj=null) {
    currentObj = currentObj ? currentObj : await filterObjByCountry(country);
    var resultArr = [];
    for(const obj of currentObj) {
        var city = null;
        if(obj.Country.toLowerCase() === country.toLowerCase()) {
            city = obj.City;
        }

        if(city && !resultArr.includes(city)) {
            resultArr.push(city);
        }
    }

    return resultArr.sort();
}

export async function filterObjByCity(city, currentObj) {
    var resultObj = currentObj?.filter((obj)=>{
        return obj?.IATA !== "\\N" && obj.City.toLowerCase() === city.toLowerCase();
    });
        
    return resultObj;
}

export async function getFlightList(properties) {
    var arr = [];
    
    // try {
    //     const res = await fetch("/api/search/flight", {  // Changed to same-origin API route
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
        const response = await fetch('/data/flights_test.json'); 

        arr = await response.json();

    } catch (error) {
        console.error("Error fetching JSON file:", error);
    }

    if(arr["best_flights"]?.length > 0) {
        for(var i=0; i<arr["best_flights"].length; i++) {
            const main_flight_obj = arr["best_flights"][i];

            //determine airline name
            var airline_name = null;
            for(const flight of main_flight_obj.flights) {
                if(airline_name !== null && airline_name !== flight.airline) {
                    airline_name = "Multiple";
                    break;
                }

                airline_name = flight.airline;
            }

            arr["best_flights"][i]["airline_name"] = airline_name;
        }

    }

    if(arr["other_flights"]?.length > 0) {
        for(var i=0; i<arr["other_flights"].length; i++) {
            const main_flight_obj = arr["other_flights"][i];

            //determine airline name
            var airline_name = null;
            for(const flight of main_flight_obj.flights) {
                if(airline_name !== null && airline_name !== flight.airline) {
                    airline_name = "Multiple";
                    break;
                }

                airline_name = flight.airline;
            }

            arr["other_flights"][i]["airline_name"] = airline_name;
        }

    }

    return {
        "best_flights" : arr["best_flights"],
        "other_flights" : arr["other_flights"]
    };
}

export function formatMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

     // Function to pad single-digit numbers with a leading zero
    //const padToTwoDigits = (num) => String(num).padStart(2, '0');

    return `${hours}hr ${minutes}min`
}

export function formatCurrency(amount, locale = 'en-US', currency = 'USD') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}
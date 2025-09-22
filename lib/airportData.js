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
        // const reader = response.body.getReader();
        // const result = await reader.read();
        // const decoder = new TextDecoder('utf-8');
        // const csvString = decoder.decode(result.value);
        arr = await response.json();

        // Papa.parse(csvString, {
        //     header: true, // If your CSV has a header row
        //     complete: (results) => {
        //         arr = results.data;
        //     },
        //     error: (error) => {
        //         console.error("Error parsing CSV:", error);
        //     }
        // });
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
    countryData = countryData ? countryData : await fetchCountryCsv();
    var countries = [];
    countryData.forEach((country)=>{
        if(country?.country_common) {
            countries.push(country.country_common);
        }
    });

    return countries;
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
        return obj.City.toLowerCase() === city.toLowerCase();
    });
        
    return resultObj;
}

// export async function getAirportByISO(iso, airportData=null) {
//     airportData = airportData ? airportData : await fetchAirportData();
//     var airports = [];
//     airportData.forEach((airport)=>{
//         if(airport.iso_country == "US") {
//             console.log(iso);
//         }
//         if(airport.iso_country === iso) {
//             console.log(iso);
//             airports.push(airport);
//         }
//     });

//     return airports;
// }
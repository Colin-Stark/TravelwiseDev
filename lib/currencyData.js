export async function fetchCurrencyData() {
    var obj = {};

    try {
        // Use the relative path to the CSV file in the public folder
        const response = await fetch('/data/currencies.json'); 
        obj = await response.json();

    } catch (error) {
        console.error("Error fetching JSON file:", error);
    }

    return obj;
}
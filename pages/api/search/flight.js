export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Extract flight details from req.body
        const {
            departure_id,
            arrival_id,
            outbound_date,
            return_date,
            type = 1, // Default to round-trip
            travel_class = 1, // Default to economy
            adults = 1, // Default to 1 adult
            currency = 'USD',
            gl = 'us',
            hl = 'en'
        } = req.body;

        // Build query parameters for SerpApi
        const params = new URLSearchParams({
            engine: 'google_flights',
            api_key: process.env.NEXT_SERP_API_KEY,
            departure_id,
            arrival_id,
            outbound_date,
            ...(return_date && { return_date }),
            type,
            travel_class,
            adults,
            currency,
            gl,
            hl
        });

        // Fetch from SerpApi
        const serpApiUrl = `https://serpapi.com/search?${params.toString()}`;
        const externalResponse = await fetch(serpApiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Check if the response is OK
        if (!externalResponse.ok) {
            const errorData = await externalResponse.json().catch(() => ({ message: 'Unknown error from SerpApi' }));
            return res.status(externalResponse.status).json(errorData);
        }

        // Return the successful response
        const data = await externalResponse.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
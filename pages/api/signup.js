export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Forward the request to the external server
        const externalResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add any other headers if needed (e.g., Authorization)
            },
            body: JSON.stringify(req.body), // Pass the request body from the frontend
        });

        // Check if the external response is OK
        if (!externalResponse.ok) {
            const errorData = await externalResponse.json().catch(() => ({ message: 'Unknown error' }));
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
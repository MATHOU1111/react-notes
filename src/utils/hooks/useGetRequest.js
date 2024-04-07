import { useState, useEffect } from 'react';

export function useGetRequest(url) {
    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!url) return;

        setLoading(true);

        async function fetchData() {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                setData(data);
                console.log(data);

            } catch (err) {
                console.error('Erreur lors de la récupération des données:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [url]);

    return { isLoading, data, error };
}



import { useState } from 'react';

const usePostRequest = (url) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const postData = async (postData) => {
        setError(null);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la requête POST');
            }

            const responseData = await response.json();
            setData(responseData);
            return responseData;
        } catch (error) {
            setError(error.message);
        } finally {
        }
    };

    return { data, error, postData };
};

export default usePostRequest;

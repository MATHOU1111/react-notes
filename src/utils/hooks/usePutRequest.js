import { useState } from 'react';

const usePutRequest = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const putData = async (url, requestData) => {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
            const responseData = await response.json();
            setData(responseData);
        } catch (err) {
            setError(err);
        }
    };

    return { data, error, putData };
};

export default usePutRequest;

import { useState } from 'react';

const useDeleteRequest = (url) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteData = async (id) => {
        setIsLoading(true);
        setError(null);

        console.log(id);

        try {
            const response = await fetch(url+`/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la requête DELETE');
            }

            // Si la requête réussit et ne retourne pas de données, nous retournons true pour indiquer le succès
            return true;
        } catch (error) {
            setError(error.message);
            return false; // Retourne false pour indiquer l'échec
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, deleteData };
};

export default useDeleteRequest;

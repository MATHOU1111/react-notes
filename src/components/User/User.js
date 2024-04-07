import {useGetRequest} from "../../utils/hooks/useGetRequest";
import {useEffect, useState} from "react";
import {Loading} from "../Loading/Loading";
import './User.css';

export function User() {
    const {data, isLoading, error} = useGetRequest("/profile");
    const [user, setUser] = useState(null);


    useEffect(() => {
        if (data) {
            setUser(data.name);
        }
    }, [data]);

    return (
        <>
            {isLoading ? (
                <div className="Loading-wrapper">
                    <Loading/>
                </div>
            ) : error ? (
                <p>Erreur dans le chargement de l'utilisateur.</p>
            ) : (
                <p>{user}</p>
            )}
        </>
    );

}
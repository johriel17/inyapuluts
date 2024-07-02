import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from 'axios';

export const useRegister = () => {
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const register = async (username, email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post('https://inyapuluts.onrender.com/api/users/register', { username, email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data))
            dispatch({ type: 'LOGIN', payload: response.data });
            setIsLoading(false);
            setErrors({})
            setError(null);
        } catch (error) {
            setError(error.response.data.error);
            setIsLoading(false);
            setErrors(error.response.data.errors)
        }
    };

    return { register, isLoading, error, errors };
};

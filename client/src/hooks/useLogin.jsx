import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from 'axios';

export const useLogin = () => {
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:4000/api/users/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data))
            dispatch({ type: 'LOGIN', payload: response.data });
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setErrors(error.response.data.errors);
            setIsLoading(false);
            
            throw error;
        }
    };

    return { login, isLoading, errors };
};

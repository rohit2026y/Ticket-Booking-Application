"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import api from '../utils/api';

interface User {
    email: string;
    id: number;
    is_admin: Boolean;
}

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
    loading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => { },
    logout: () => { },
    loading: true,
    isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            const token = Cookies.get('token');
            if (token) {
                try {
                    const decoded: any = jwtDecode(token);
                    // In a real app, might want to verify token with backend or fetch full user profile
                    setUser({ email: decoded.sub, id: parseInt(decoded.sub), is_admin: false }); // Rudimentary decoding, ideally fetch user/me
                } catch (error) {
                    console.error("Invalid token", error);
                    Cookies.remove('token');
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = (token: string) => {
        Cookies.set('token', token, { expires: 1 }); // 1 day
        const decoded: any = jwtDecode(token);
        setUser({ email: decoded.sub, id: parseInt(decoded.sub), is_admin: false }); // Update this if token has more info
        router.push('/');
    };

    const logout = () => {
        Cookies.remove('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

import { useState } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [isAuth, setIsAuth] = useState(() => localStorage.getItem('token') !== null);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        setIsAuth(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuth(false);
    };

    return (
        <AuthContext.Provider value={{isAuth, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

import { createContext } from "react";

interface AuthContextProps {
    isAuth: boolean;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

/**
 * User interface representing authenticated user details.
 */
interface User {
    id: number;
    fullName: string;
    email: string;
    mobile?: string;
    role: string;
    profilePicture?: string;
}

/**
 * Auth context type definition.
 */
interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
    updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider that wraps the app and provides authentication state.
 * Persists user data and JWT token in localStorage.
 */
export function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
    }, []);

    /**
     * Login - store user and token in state and localStorage.
     */
    const login = (user: User, token: string) => {
        setUser(user);
        setToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
    };

    /**
     * Logout - clear user and token from state and localStorage.
     */
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    /**
     * Update user details in state and localStorage.
     */
    const updateUser = (updatedUser: Partial<User>) => {
        if (user) {
            const newUser = { ...user, ...updatedUser };
            setUser(newUser);
            localStorage.setItem("user", JSON.stringify(newUser));
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook to access auth context.
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
}


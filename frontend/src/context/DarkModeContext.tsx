import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface DarkModeContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

/**
 * Dark Mode Provider that persists theme preference in localStorage.
 * Adds/removes 'dark' class on the document root element.
 */
export function DarkModeProvider({ children }: { children: ReactNode }) {

    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem("darkMode");
        return saved === "true";
    });

    useEffect(() => {
        localStorage.setItem("darkMode", String(darkMode));
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
}

export function useDarkMode() {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error("useDarkMode must be used inside DarkModeProvider");
    }
    return context;
}

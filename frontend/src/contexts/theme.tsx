import { createContext, useContext, useState, useEffect } from "react";

export type ThemeType =
  | "default"
  | "gamified"
  | "neon"
  | "nature"
  | "minimalist";

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>("default");

  useEffect(() => {
    const savedTheme = localStorage.getItem("expenseTrackerTheme") as ThemeType;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const updateTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem("expenseTrackerTheme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

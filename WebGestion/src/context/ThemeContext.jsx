// ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

export const themes = {
  light: "light",
  dark: "dark",
  darkblue:"darkblue",
  ayuDark: "ayu-dark",
  ayuLight: "ayu-light",
  dracula: "dracula",
  monokai: "monokai",
  nightOwlLight: "night-owl-light",
  nightOwlDark: "night-owl-dark",
  solarizedLight: "solarized-light",
  solarizedDark: "solarized-dark",
  nord: "nord",
  cobalt: "cobalt",
  neonPurple: "neon-purple",
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.light);

  useEffect(() => {
    // Remover todas las clases de tema y añadir la del tema actual
    Object.values(themes).forEach((t) =>
      document.documentElement.classList.remove(t)
    );
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Función para alternar cíclicamente entre los temas disponibles
  const toggleTheme = () => {
    const themeValues = Object.values(themes);
    const currentIndex = themeValues.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeValues.length;
    setTheme(themeValues[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

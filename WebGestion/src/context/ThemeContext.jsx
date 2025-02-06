// ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export const themes = {
  system: "system", // Opción que sincroniza con el sistema operativo
  light: "light",
  dark: "dark",
  darkblue: "darkblue",
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
  cyberpunk: "cyberpunk",
  forest: "forest",
  ocean: "ocean",
  sunset: "sunset",
  nordic: "nordic",
  retroWave: "retro-wave",
  mint: "mint",
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Intentamos leer el tema seleccionado del localStorage; si no existe, usamos el tema light
  const storedTheme = localStorage.getItem("selectedTheme");
  const [selectedTheme, setSelectedTheme] = useState(storedTheme || themes.light);
  // Tema efectivo que se aplicará globalmente: si el seleccionado es "system", se calculará según la preferencia del sistema
  const [effectiveTheme, setEffectiveTheme] = useState(themes.light);

  const updateEffectiveTheme = useCallback(() => {
    if (selectedTheme === themes.system && window.matchMedia) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setEffectiveTheme(prefersDark ? themes.dark : themes.light);
    } else {
      setEffectiveTheme(selectedTheme);
    }
  }, [selectedTheme]);

  useEffect(() => {
    updateEffectiveTheme();

    let mediaQuery;
    if (selectedTheme === themes.system && window.matchMedia) {
      mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => updateEffectiveTheme();
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [selectedTheme, updateEffectiveTheme]);

  useEffect(() => {
    // Se remueven todas las clases de tema y se añade la del effectiveTheme
    Object.values(themes).forEach((t) => document.documentElement.classList.remove(t));
    document.documentElement.classList.add(effectiveTheme);
    document.documentElement.setAttribute("data-theme", effectiveTheme);
  }, [effectiveTheme]);

  // Cada vez que se actualice selectedTheme, lo guardamos en localStorage
  useEffect(() => {
    localStorage.setItem("theme", selectedTheme);
  }, [selectedTheme]);

  const toggleTheme = () => {
    const themeValues = Object.values(themes);
    const currentIndex = themeValues.indexOf(selectedTheme);
    const nextIndex = (currentIndex + 1) % themeValues.length;
    setSelectedTheme(themeValues[nextIndex]);
  };

  const setSpecificTheme = (newTheme) => {
    if (Object.values(themes).includes(newTheme)) {
      setSelectedTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme: effectiveTheme, toggleTheme, setSpecificTheme, selectedTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

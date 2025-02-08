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
  // Leer el tema almacenado en localStorage (con clave "theme"), si existe; sino, usar el tema light.
  const storedTheme = localStorage.getItem("theme");
  const [selectedTheme, setSelectedTheme] = useState(storedTheme || themes.system);
  // Tema efectivo que se aplicará globalmente: si el seleccionado es "system", se calculará según la preferencia del sistema.
  const [effectiveTheme, setEffectiveTheme] = useState(storedTheme || themes.system);

  const updateEffectiveTheme = useCallback(() => {
    if (selectedTheme === themes.system && window.matchMedia) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setEffectiveTheme(prefersDark ? themes.dark : themes.system);
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

  // Guardar el tema seleccionado en localStorage cada vez que cambie
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
    <ThemeContext.Provider value={{ theme: effectiveTheme, toggleTheme, setSpecificTheme, selectedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

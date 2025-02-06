// ThemeSelector.jsx
import React, { useState } from "react";
import { useTheme, themes } from "@/context/ThemeContext";

// Función para concatenar clases condicionalmente
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ThemePreview = ({ themeId, isSelected }) => {
  return (
    <div
      data-theme={themeId}
      className={cn(
        "preview w-full h-32 rounded-lg border-2 overflow-hidden transition-all",
        isSelected ? "border-blue-500 ring-2 ring-blue-500" : "border-gray-300"
      )}
    >
      <div className="w-full h-full p-3" style={{ background: "var(--primary-bg)" }}>
        <div className="flex items-center gap-1 mb-3">
          <div className="w-2 h-2 rounded-full" style={{ background: "var(--active-bg)" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "var(--hover-bg)" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "var(--border-color)" }} />
        </div>
        <div className="space-y-2">
          <div className="h-2 w-3/4 rounded" style={{ background: "var(--secondary-bg)" }} />
          <div className="h-2 w-1/2 rounded" style={{ background: "var(--border-color)" }} />
          <div className="flex items-center gap-2 mt-4">
            <div className="h-6 w-16 rounded" style={{ background: "var(--active-bg)" }} />
            <div className="h-4 w-4 rounded-full" style={{ background: "var(--primary-text)" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const availableThemes = [
  { id: themes.system, label: "System" },
  { id: themes.light, label: "Light" },
  { id: themes.dark, label: "Dark" },
  { id: themes.darkblue, label: "Dark Blue" },
  { id: themes.ayuDark, label: "Ayu Dark" },
  { id: themes.ayuLight, label: "Ayu Light" },
  { id: themes.dracula, label: "Dracula" },
  { id: themes.monokai, label: "Monokai" },
  { id: themes.nightOwlLight, label: "Night Owl Light" },
  { id: themes.nightOwlDark, label: "Night Owl Dark" },
  { id: themes.solarizedLight, label: "Solarized Light" },
  { id: themes.solarizedDark, label: "Solarized Dark" },
  { id: themes.nord, label: "Nord" },
  { id: themes.cobalt, label: "Cobalt" },
  { id: themes.neonPurple, label: "Neon Purple" },
  { id: themes.cyberpunk, label: "Cyberpunk" },
  { id: themes.forest, label: "Forest" },
  { id: themes.ocean, label: "Ocean" },
  { id: themes.sunset, label: "Sunset" },
  { id: themes.nordic, label: "Nordic" },
  { id: themes.retroWave, label: "Retro Wave" },
  { id: themes.mint, label: "Mint" },
];

export default function ThemeSelector() {
  // Aquí usamos el "theme" efectivo y setSpecificTheme para cambiarlo
  const { theme, setSpecificTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);

  const handleThemeChange = (newTheme) => {
    setSelectedTheme(newTheme);
    setSpecificTheme(newTheme);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Selecciona un Tema</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {availableThemes.map((t) => (
          <label key={t.id} className="relative space-y-2 cursor-pointer block">
            <ThemePreview themeId={t.id} isSelected={selectedTheme === t.id} />
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="radio"
                name="theme"
                value={t.id}
                checked={selectedTheme === t.id}
                onChange={() => handleThemeChange(t.id)}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span>{t.label}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

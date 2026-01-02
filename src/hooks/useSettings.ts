import { useState, useEffect, useCallback } from "react";

interface Settings {
  model: string;
  theme: "light" | "dark" | "system";
  sendWithEnter: boolean;
  soundEffects: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  model: "openai/gpt-5",
  theme: "dark",
  sendWithEnter: true,
  soundEffects: false,
};

const SETTINGS_KEY = "lumora-settings";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings:", e);
    }
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateModel = useCallback((model: string) => {
    updateSetting("model", model);
  }, [updateSetting]);

  return {
    settings,
    updateSetting,
    updateModel,
    model: settings.model,
  };
}

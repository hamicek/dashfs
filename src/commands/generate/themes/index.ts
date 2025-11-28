// Theme system for dashboard styles

import { ThemeType } from "../../../types.js";
import { getDefaultTheme } from "./default.js";
import { getTerminalTheme } from "./terminal.js";
import { getNotionTheme } from "./notion.js";
import { getGlassTheme } from "./glass.js";
import { getPaperTheme } from "./paper.js";
import { getDashboardTheme } from "./dashboard.js";
import { getNordTheme } from "./nord.js";
import { getBrutalistTheme } from "./brutalist.js";
import { getSunsetTheme } from "./sunset.js";

export type ThemeStyles = {
  css: string;
  // Some themes may need different HTML structure hints
  bodyClass?: string;
};

export function getTheme(theme: ThemeType = "default"): ThemeStyles {
  switch (theme) {
    case "terminal":
      return getTerminalTheme();
    case "notion":
      return getNotionTheme();
    case "glass":
      return getGlassTheme();
    case "paper":
      return getPaperTheme();
    case "dashboard":
      return getDashboardTheme();
    case "nord":
      return getNordTheme();
    case "brutalist":
      return getBrutalistTheme();
    case "sunset":
      return getSunsetTheme();
    case "default":
    default:
      return getDefaultTheme();
  }
}

// List of available themes with descriptions
export const AVAILABLE_THEMES: Record<ThemeType, string> = {
  default: "Clean, modern cards with light/dark mode",
  terminal: "Retro terminal look with green text on black",
  notion: "Minimal, spacious design inspired by Notion",
  glass: "Glassmorphism with blur effects and gradients",
  paper: "Classic document style with serif fonts",
  dashboard: "Dark analytics dashboard with accent colors",
  nord: "Calm Nordic color palette",
  brutalist: "Raw, minimal no-nonsense design",
  sunset: "Warm gradient with orange/pink tones",
};

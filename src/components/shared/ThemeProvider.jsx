"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Intercept and swallow the React 19 script tag warning 
// This must run outside the component to catch the error during the initial client render
if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag while rendering React component")
    ) {
      return; // Ignore this specific next-themes error
    }
    originalError.apply(console, args);
  };
}

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
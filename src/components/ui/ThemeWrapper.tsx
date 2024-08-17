"use client";

import React, { useEffect } from 'react';
import { ThemeProvider, useTheme } from "@/components/ui/ThemeContext";

function ThemeApplier({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
}

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeApplier>{children}</ThemeApplier>
    </ThemeProvider>
  );
}
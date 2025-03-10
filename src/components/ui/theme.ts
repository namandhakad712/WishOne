// Theme configuration for the Kwity-inspired design system

export const theme = {
  colors: {
    primary: {
      main: "#0f3c2d", // Deep emerald green
      light: "#e8eeeb", // Light mint
      dark: "#092018", // Darker green
    },
    secondary: {
      main: "#a17dd0", // Purple
      light: "#d9c9f1", // Light purple
      dark: "#7c5bb7", // Dark purple
    },
    accent: {
      coral: "#ff8a80", // Coral/pink
      peach: "#ffab91", // Peach
      mint: "#b2dfdb", // Mint
      lavender: "#d1c4e9", // Lavender
    },
    neutral: {
      white: "#ffffff",
      offWhite: "#f8f9fa",
      lightGray: "#e9ecef",
      gray: "#adb5bd",
      darkGray: "#495057",
      black: "#212529",
    },
  },
  typography: {
    fontFamily: {
      serif: '"Fraunces", serif',
      sans: '"Inter", sans-serif',
    },
    fontWeights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  borderRadius: {
    small: "8px",
    medium: "12px",
    large: "16px",
    xl: "24px",
    full: "9999px",
  },
  shadows: {
    small: "0 2px 8px rgba(0, 0, 0, 0.05)",
    medium: "0 4px 12px rgba(0, 0, 0, 0.08)",
    large: "0 8px 24px rgba(0, 0, 0, 0.12)",
  },
};

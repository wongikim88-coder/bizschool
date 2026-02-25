/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      colors: {
        // Blue family
        blue: {
          primary: "#155dfc", // Brand blue - CTA buttons, badges, accent text
          DEFAULT: "#155dfc",
          deep: "#1447e6", // Darker blue - emphasis text
          medium: "#2b7fff", // Medium blue - decorative elements
          light: "#50a2ff", // Light blue - decorative elements
          tint: "#eff6ff", // Very light blue - section backgrounds
          gray: "#abb2bf", // Blue-gray - code block default text
        },
        // Black / Dark family
        dark: {
          DEFAULT: "#101828", // Dark navy - headings, dark section backgrounds
          navy: "#101828",
          deep: "#1e2839", // Deep navy - code area overlay
          charcoal: "#282c34", // Dark charcoal - code block backgrounds
          gray: "#4a5565", // Dark gray - body/paragraph text
          muted: "#6a7282", // Medium dark gray - secondary text, labels
          black: "#000000", // Pure black - footer text
        },
      },
    },
  },
  plugins: [],
};

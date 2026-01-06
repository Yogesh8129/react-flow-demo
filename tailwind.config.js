/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Poppins",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      colors: {
        // Semantic colors from Digital Cockpit
        success: "var(--success)",
        warning: "var(--warning)",
        // Node type colors (mapped to Digital Cockpit palette)
        node: {
          device: "#3B82F6", // info blue
          rule: "#F59E0B", // warning amber
          email: "#6FCE34", // success green
          sms: "#8B5CF6", // violet (kept for distinction)
        },
      },
      borderRadius: {
        DEFAULT: "6px",
        sm: "4px",
        md: "8px",
        lg: "10px",
        xl: "12px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 2px 8px rgba(0, 0, 0, 0.08)",
        md: "0 4px 12px rgba(0, 0, 0, 0.1)",
        lg: "0 12px 24px rgba(0, 0, 0, 0.12)",
        xl: "0 20px 40px rgba(0, 0, 0, 0.15)",
      },
      transitionDuration: {
        fast: "150ms",
        DEFAULT: "200ms",
        medium: "250ms",
        slow: "300ms",
      },
      transitionTimingFunction: {
        DEFAULT: "ease",
        sidebar: "cubic-bezier(0.25, 1, 0.5, 1)",
      },
      zIndex: {
        base: "0",
        raised: "10",
        dropdown: "100",
        sticky: "200",
        overlay: "300",
        modal: "400",
        popover: "500",
        toast: "600",
      },
      spacing: {
        sidebar: "270px",
        "sidebar-collapsed": "74px",
      },
    },
  },
  plugins: [],
};

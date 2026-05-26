/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        surface2: "rgb(var(--color-surface-2) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        accent2: "rgb(var(--color-accent-2) / <alpha-value>)",
        accent3: "rgb(var(--color-accent-3) / <alpha-value>)",
        accentSoft: "rgb(var(--color-accent-soft) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
      },
      fontSize: {
        display: ["clamp(2.8rem, 4vw, 4.6rem)", { lineHeight: "1.05" }],
        headline: ["clamp(2rem, 3vw, 3rem)", { lineHeight: "1.15" }],
        title: ["1.5rem", { lineHeight: "1.3" }],
        subtitle: ["1.1rem", { lineHeight: "1.5" }],
      },
      boxShadow: {
        glow: "0 0 24px rgb(var(--color-accent) / 0.35)",
        glass: "0 8px 30px rgb(0 0 0 / 0.35)",
        intense: "0 28px 70px rgb(0 0 0 / 0.5)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top, rgb(34 37 58), rgb(9 10 14) 60%)",
        glow: "radial-gradient(circle at 20% 20%, rgb(var(--color-accent) / 0.35), transparent 55%)",
        noir: "radial-gradient(circle at top, rgb(34 34 48), rgb(9 10 14) 65%)",
        aurora:
          "radial-gradient(circle at 10% 15%, rgb(var(--color-accent) / 0.2), transparent 55%), radial-gradient(circle at 85% 10%, rgb(var(--color-accent-2) / 0.2), transparent 60%)",
      },
      backdropBlur: {
        glass: "18px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shine: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        rise: "rise 0.6s ease-out",
        shine: "shine 3.5s linear infinite",
      },
      fontFamily: {
        sans: ["Space Grotesk", "ui-sans-serif", "system-ui"],
      },
    },
  },
};

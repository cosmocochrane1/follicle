/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],

  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        serif: ["Canela Text", "serif"],
      },
      boxShadow: {
        cardShadow: "2px 3px 36px rgba(170, 210, 235, 0.2)",
      },
      colors: {
        primaryText: "#545454",
        secondaryText: "#1F1F1F",
        lightBlue: "#F4FCFB",
        darkBlue: "#2FCFBA",
        orange: "#EC493A",
        lightOrange: "#FFF8F8",
        black: "#363636",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--tertiary-foreground))",
          foregroundSecondary: "hsl(var(--tertiary-foreground-secondary))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "30px",
        md: "26px",
        sm: "24px",
        xs: "22px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      // fontSize: {
      //   1: '12px',
      //   2: '17px',
      //   3: '18px',
      //   4: '20px',
      //   5: '24px',
      //   6: '30px',
      //   7: '36px',
      //   8: '46px',
      //   9: '60px',
      //   10: '72px',
      //   12: '89px'
      // },
      // spacing: {
      //   1: '2px',
      //   2: '4px',
      //   3: '8px',
      //   4: '14px',
      //   5: '16px',
      //   6: '20px',
      //   7: '33px',
      //   8: '40px',
      //   9: '50px',
      //   10: '60px',
      //   11: '80px',
      //   12: '128px',
      //   13: '160px',

      // },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

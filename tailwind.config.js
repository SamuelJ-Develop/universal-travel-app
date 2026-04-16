/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        sand: "#F4EFE4",
        ink: "#102418",
        moss: "#335C41",
        rust: "#C8623B",
        clay: "#D6B79C",
      },
    },
  },
  plugins: [],
};

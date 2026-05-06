/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  corePlugins: {
    // Disable Tailwind's CSS reset (Preflight) so it doesn't
    // override the existing App.css design system.
    // All utility classes (flex, p-4, text-xl, etc.) still work normally.
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
}


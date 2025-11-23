/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			colors: {
				brand: {
					bg: "#050505", // Negro Fondo
					card: "#0a0a0a", // Negro Tarjeta
					border: "#262626", // Borde Gris
					blue: "#3b82f6", // Azul Eléctrico
					text: "#e2e8f0", // Texto Claro
					muted: "#94a3b8", // Texto Gris
				},
			},
			fontFamily: {
				sans: ['"Plus Jakarta Sans"', "sans-serif"],
				display: ['"Syne"', "sans-serif"],
			},
			animation: {
				"fade-in": "fadeIn 0.6s ease-out forwards",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0", transform: "translateY(20px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
			},
		},
	},
	plugins: [],
};

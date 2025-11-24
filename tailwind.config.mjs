/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			colors: {
				brand: {
					bg: "#050505", // Fondo principal
					card: "#0a0a0a", // Fondo de las tarjetas
					border: "#262626", // Bordes finos
					blue: "#3b82f6", // El Azul de HITRO
					text: "#e2e8f0", // Texto blanco roto
					muted: "#94a3b8", // Texto gris secundario
				},
			},
			fontFamily: {
				// Aquí definimos las dos fuentes
				sans: ['"Plus Jakarta Sans"', "sans-serif"],
				display: ['"Syne"', "sans-serif"],
			},
			// Animaciones para que se sienta premium
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

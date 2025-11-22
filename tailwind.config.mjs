/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			colors: {
				// Definimos la paleta semántica.
				// Si mañana tu tío quiere la web roja, solo cambias esto aquí.
				brand: {
					bg: "#050505", // Negro Profundo (Fondo)
					card: "#0a0a0a", // Negro Elevado (Tarjetas)
					border: "#262626", // Bordes sutiles
					primary: "#3b82f6", // Azul Eléctrico (Acción)
					text: "#e2e8f0", // Texto principal (No blanco puro)
					muted: "#94a3b8", // Texto secundario (Gris)
				},
			},
			fontFamily: {
				// Definiremos estas fuentes en el layout luego
				sans: ["Plus Jakarta Sans", "sans-serif"],
				display: ["Syne", "sans-serif"], // Para títulos grandes
			},
			animation: {
				"fade-in": "fadeIn 0.5s ease-out forwards",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
			},
		},
	},
	plugins: [],
};

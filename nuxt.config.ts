// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-04-03",
	devtools: { enabled: true },
	modules: ["@nuxt/ui"],
	ui: {
		primary: "green",
		gray: "cool",
	},
	ssr: false,
	runtimeConfig: {
		public: {
			apiUrl: process.env.API_URL,
			frontendUrl: process.env.FRONTEND_URL,
		},
	},
});

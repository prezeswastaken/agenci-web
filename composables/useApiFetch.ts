import type { UseFetchOptions } from "nuxt/app";

export function useApiFetch<T>(path: string, options: any = {}) {
	const config = useRuntimeConfig();
	let headers: any = {
		referer: config.public.frontendUrl,
		charset: "UTF-8",
	};

	return $fetch<T>(`${config.public.apiUrl}${path}`, {
		watch: false,
		...options,
		headers: {
			...headers,
			...options?.headers,
		},
	});
}

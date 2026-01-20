/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_CLERK_PUBLISHABLE_KEY: string

	readonly VITE_API_PROXY: string

	readonly VITE_AUTOSAVE_DELAY: number
	readonly VITE_RECENT_TIME_UPDATE_AT: number
	readonly VITE_TRANSITION_DURATION: number
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}

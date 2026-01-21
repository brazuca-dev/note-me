import { useAuth } from '@clerk/clerk-react'

interface JsonResponse<T> {
	status: number
	message: string
	data: T
}

type UseFetchResponse = Promise<
	{
		json: <T>() => Promise<JsonResponse<T>>
	} & Response
>

type UseFetchProps = RequestInit & { subUrl?: string }

/**
 * Custom hook for making authorized HTTP requests.
 * @param baseUrl - The base URL for the API.
 * @returns A function that can be used to make HTTP requests.
 */
export function useAuthFetch(baseUrl: string) {
	const { getToken } = useAuth()

	return async (options?: UseFetchProps): UseFetchResponse => {
		const token = await getToken()

		const headers: HeadersInit = {
			Authorization: `Bearer ${token}`,
			...options?.headers,
		}

		const { subUrl } = options || {}
		const url = `${baseUrl}${subUrl || ''}`

		return fetch(url, { ...options, headers })
	}
}

import { useRef, useCallback } from 'react'
import { IS_SLEEP_CANCELLED, sleep } from '@/lib/sleep'

/**
 * Custom hook that debounces a function call.
 * @param callback - The function to be debounced.
 * @param delay - The delay in milliseconds.
 * @returns A debounced function.
 *
 * The debounced function will wait for the specified delay before executing the callback.
 * If the function is called again before the delay has passed, the previous call will be cancelled and the callback will return null.
 * Otherwise, the callback will be executed and expected result will be returned.
 */
export function useDebounce<T extends (...args: any[]) => any>(
	callback: T,
	delay: number
): (...args: Parameters<T>) => Promise<ReturnType<T> | null> {
	const abortControllerRef = useRef<AbortController | null>(null)

	return useCallback(
		async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
			// 1. Se houver uma chamada pendente, cancelamos ela imediatamente
			if (abortControllerRef.current) abortControllerRef.current.abort()

			// 2. Criamos um novo controlador para esta nova chamada
			const controller = new AbortController()
			abortControllerRef.current = controller

			try {
				// 3. Aguardamos o tempo do debounce usando nosso utilitário
				await sleep(delay, controller.signal)
				// 4. Se o tempo passou sem novo cancelamento, executamos o callback
				return await callback(...args)
			} catch (error: any) {
				if (error === IS_SLEEP_CANCELLED) return null
				// Repropagamos o erro para que o componente saiba que foi cancelado
				throw error
			} finally {
				// Se esta for a chamada que terminou, limpamos a ref
				if (abortControllerRef.current === controller) {
					abortControllerRef.current = null
				}
			}
		},
		[callback, delay]
	)
}

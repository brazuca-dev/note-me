import { useRef } from 'react'

/**
 * @param callback - The function to be throttled.
 * @param delay - The delay in milliseconds.
 * @returns A throttled version of the callback function.
 *
 * The throttled function will not be called more than once within the specified delay.
 */
export function useThrottle<T extends (...args: any[]) => void>(
	callback: T,
	delay: number
) {
	let lastCallRef = useRef<number>(0)

	return (...args: any[]) => {
		const now = Date.now()

		const timeSinceLastCall = now - lastCallRef.current
		const hasPassedDelay = delay <= timeSinceLastCall

		if (hasPassedDelay) {
			callback(...args)
			lastCallRef.current = now
		}
	}
}

export const IS_SLEEP_CANCELLED = 'AbortError'

export function sleep(milliseconds: number, signal?: AbortSignal) {
	return new Promise((resolve, reject) => {
		const timeoutId = setTimeout(resolve, milliseconds)

		signal?.addEventListener(
			'abort',
			() => {
				clearTimeout(timeoutId)
				reject(
					new DOMException(
						`Sleep of ${milliseconds} was aborted`,
						IS_SLEEP_CANCELLED
					)
				)
			},
			{ once: true }
		)
	})
}

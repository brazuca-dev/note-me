import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

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

export function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
	return Object.fromEntries(
		Object.entries(obj).filter(([_, v]) => v !== undefined)
	) as Partial<T>
}

export function isEmpty(value: any): boolean {
	const isPrimitiveEmpty = value === undefined || value === null
	const isArrayEmpty = Array.isArray(value) && value.length === 0
	return isPrimitiveEmpty || isArrayEmpty
}

export type SyncResponse = [isRemoteSynced: boolean, isLocalSynced: boolean]

const onlyLocalSynced = (isLocalSynced: boolean): SyncResponse => [
	false,
	isLocalSynced,
]
const syncedBoth = ({
	isRemoteSynced,
	isLocalSynced,
}: {
	isRemoteSynced: boolean
	isLocalSynced: boolean
}): SyncResponse => [isRemoteSynced, isLocalSynced]
const syncFailed = (): SyncResponse => [false, false]

export const sync = {
	local: onlyLocalSynced,
	both: syncedBoth,
	failed: syncFailed,
}

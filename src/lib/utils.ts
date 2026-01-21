import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
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

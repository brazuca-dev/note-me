import { toast } from 'sonner'

export interface NotifyOptions {
	message: string
	description?: string
	type?: 'success' | 'error' | 'warning' | 'info'
}

const variants = {
	success: {
		color: 'var(--success)',
	},
	error: {
		color: 'var(--destructive)',
	},
	warning: {
		color: 'var(--warning)',
	},
	info: {
		color: 'var(--info)',
	},
}

export function notify({ type = 'info', message, description }: NotifyOptions) {
	toast[type](message, { description, style: variants[type] })
}

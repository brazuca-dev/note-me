import Pin from 'lucide-react/dist/esm/icons/pin'
import { twMerge } from 'tailwind-merge'

interface PinIconProps {
	variant?: 'outline' | 'filled'
	className?: string
}

export function PinIcon({ variant = 'outline', className }: PinIconProps) {
	return (
		<Pin
			data-variant={variant}
			className={twMerge('data-[variant=filled]:fill-current', className)}
		/>
	)
}

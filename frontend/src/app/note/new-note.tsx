import type { VariantProps } from 'class-variance-authority'
import Plus from 'lucide-react/dist/esm/icons/plus'
import type { ComponentProps } from 'react'
import { useNote } from '@/hooks/use-note'
import { Button, type buttonVariants } from '@/components/ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { Show } from '@/components/utils'
import { useThrottle } from '@/hooks/use-throttling'

interface NewNoteProps
	extends ComponentProps<'button'>,
		VariantProps<typeof buttonVariants> {
	withTitle?: boolean
}

const THROTTLE_TIME = 1_000

export function NewNote({
	withTitle = false,
	variant = 'secondary',
	...props
}: NewNoteProps) {
	const { createNote } = useNote()
	const createNoteThrottle = useThrottle(createNote, THROTTLE_TIME)

	return (
		<Show
			condition={!withTitle}
			fallback={
				<Button variant={variant} onClick={createNoteThrottle} {...props}>
					<Plus /> Create a new note
				</Button>
			}
		>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						size='icon'
						variant={variant}
						onClick={createNoteThrottle}
						{...props}
					>
						<Plus />
					</Button>
				</TooltipTrigger>
				<TooltipContent className='font-semibold text-sm'>
					Create a note
				</TooltipContent>
			</Tooltip>
		</Show>
	)
}

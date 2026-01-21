import { ContextMenuItem } from '@/components/ui/context-menu'
import { Show } from '@/components/utils'
import Pin from 'lucide-react/dist/esm/icons/pin'
import PinOff from 'lucide-react/dist/esm/icons/pin-off'

interface PinMenuItemProps {
	isPinned: boolean
	onClick: () => void
}

export function PinMenuItem({ isPinned, onClick }: PinMenuItemProps) {
	return (
		<ContextMenuItem onClick={onClick}>
			<Show
				condition={isPinned}
				fallback={
					<>
						<Pin /> Pin
					</>
				}
			>
				<PinOff /> Pin off
			</Show>
		</ContextMenuItem>
	)
}

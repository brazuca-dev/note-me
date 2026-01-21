import { ContextMenuItem } from '@/components/ui/context-menu'
import Trash from 'lucide-react/dist/esm/icons/trash'

interface TrashMenuItemProps {
	onClick: () => void
}

export function TrashMenuItem({ onClick }: TrashMenuItemProps) {
	return (
		<ContextMenuItem variant='destructive' onClick={onClick}>
			<Trash /> Trash
		</ContextMenuItem>
	)
}

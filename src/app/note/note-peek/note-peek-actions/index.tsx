import { ContextMenuContent } from '@/components/ui/context-menu'
import type { Note, Tag } from '@/data/interfaces'
import { PinMenuItem } from './pin-menu-item'
import { TagsSubMenu } from './tags-sub-menu'
import { TrashMenuItem } from './trash-menu-item'

interface NoteActionsProps {
	note: Note
	tags?: Tag[]
	tagsByNote?: (Tag | undefined)[]
	onTogglePin: () => void
	onToggleTrash: () => void
}

export const NotePeekActions = ({
	note,
	tags,
	tagsByNote,
	onTogglePin,
	onToggleTrash,
}: NoteActionsProps) => {
	return (
		<ContextMenuContent>
			<PinMenuItem isPinned={note.isPinned} onClick={onTogglePin} />
			<TagsSubMenu noteId={note.id} tags={tags} tagsByNote={tagsByNote} />
			<TrashMenuItem onClick={onToggleTrash} />
		</ContextMenuContent>
	)
}

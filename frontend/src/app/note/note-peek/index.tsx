import type { Note } from '@/data/interfaces'
import { useLiveQueryTag } from '@/hooks/use-live-query/tag'
import { useNote } from '@/hooks/use-note'
import { NotePeekActions } from './note-peek-actions'
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu'
import { NoteFooter, NoteHeader } from './note-peek-info'
import { NoteSpoiler } from './note-peek-spoiler'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { useEditor } from '@/global/context/editor-context'
import { isNoteRecent } from './note-peek.utils'

const RECENT_TIME_DIFF = import.meta.env.VITE_RECENT_TIME_UPDATE_AT

interface NotePeekProps {
	note: Note
}

export const NotePeek = ({ note }: NotePeekProps) => {
	const { selectedNote, handleNoteSelect } = useEditor()
	const { toggleIsPinned, toggleIsTrashed } = useNote()

	const { tags, tagsByNote } = useLiveQueryTag({
		searchTagByNoteId: note.id,
	})

	const createdAt = new Date(note.createdAt)
	const isRecent = isNoteRecent(createdAt, RECENT_TIME_DIFF)
	const isSelected = selectedNote?.id === note.id

	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<SidebarMenuButton
					aria-selected={isSelected}
					onClick={() => handleNoteSelect(note)}
					className='aria-selected:bg-card flex flex-col items-start h-fit p-4 border border-border transition-all duration-300'
				>
					<NoteHeader title={note.title} isPinned={note.isPinned} />
					<NoteSpoiler content={note.content} />
					<NoteFooter
						isRecent={isRecent}
						tagsByNote={tagsByNote}
						createdAt={createdAt}
					/>
				</SidebarMenuButton>
			</ContextMenuTrigger>

			<NotePeekActions
				note={note}
				tags={tags}
				tagsByNote={tagsByNote}
				onTogglePin={() => toggleIsPinned(note.id)}
				onToggleTrash={() => toggleIsTrashed(note.id)}
			/>
		</ContextMenu>
	)
}

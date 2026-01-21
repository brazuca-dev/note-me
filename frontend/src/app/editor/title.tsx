import { useDebounce } from '@/hooks/use-debounce'
import { useNote } from '@/hooks/use-note'
import { type ChangeEvent } from 'react'
import { useEditor } from '@/global/context/editor-context'

export function Title() {
	const { selectedNote } = useEditor()
	const { updateNote } = useNote()

	const handleTitleChange = useDebounce(
		async (e: ChangeEvent<HTMLInputElement>) => {
			if (!selectedNote) return

			await updateNote({
				id: selectedNote.id,
				title: e.target.value,
			})
		},
		import.meta.env.VITE_AUTOSAVE_DELAY
	)

	return (
		<input
			type='text'
			defaultValue={selectedNote?.title}
			onChange={handleTitleChange}
			placeholder='Give a title to your note :p'
			className='text-2xl border-none outline-0 flex-1 ml-2 mr-8 w-max min-w-96 font-semibold'
		/>
	)
}

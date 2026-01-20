import { EditorContent, useEditor, type EditorEvents } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEditor as useEditorContext } from '@/global/context/editor-context'
import { BubbleMenu } from './bubble-menu'
import { Fragment } from 'react/jsx-runtime'
import { useNote } from '@/hooks/use-note'
import { useEffect } from 'react'
import { useSave } from '@/global/context/save-context'
import { useDebounce } from '@/hooks/utils/use-debounce'

export default function Tiptap() {
	const { updateNote } = useNote()
	const { selectedNote, isEditorEnabled } = useEditorContext()
	const { startSaving, handleIsSaved } = useSave()

	const autosave = useDebounce(
		({ editor }: EditorEvents['update']) => {
			if (!selectedNote || selectedNote.content === editor.getHTML()) return

			startSaving(async () => {
				try {
					const [isRemoteSynced, isLocalSynced] = await updateNote({
						id: selectedNote.id,
						content: editor.getHTML(),
					})

					if (isRemoteSynced && isLocalSynced)
						return handleIsSaved(true, 'both')
					if (!isRemoteSynced && !isLocalSynced)
						return handleIsSaved(false, 'both')

					handleIsSaved(true, isRemoteSynced ? 'remote' : 'local')
				} catch (_) {
					handleIsSaved(false, 'both')
				}
			})
		},
		import.meta.env.VITE_AUTOSAVE_DELAY
	)

	const editor = useEditor({
		extensions: [StarterKit],
		autofocus: false,
		content: selectedNote?.content,
		onUpdate: autosave,
		editable: isEditorEnabled,
	})

	useEffect(() => {
		editor.commands.setContent(selectedNote?.content || '')
	}, [selectedNote!.id])

	useEffect(() => {
		editor.setEditable(isEditorEnabled)
	}, [isEditorEnabled])

	return (
		<Fragment>
			<EditorContent editor={editor} className='pb-8' />
			<BubbleMenu editor={editor} />
		</Fragment>
	)
}

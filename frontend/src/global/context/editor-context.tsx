import {
	createContext,
	useContext,
	useState,
	useCallback,
	type ReactNode,
	useMemo,
} from 'react'
import type { Note } from '@/data/interfaces'

interface EditorContextProps {
	selectedNote: Note | null
	handleNoteSelect: (note: Note | null) => void
	selectedTags: Set<string>
	handleTagsSelected: (id: string) => void
	isEditorEnabled: boolean
	handleToggleIsEditorEnabled: () => void
}

const EditorContext = createContext<EditorContextProps | null>(null)

export const EditorProvider = ({ children }: { children: ReactNode }) => {
	const [selectedNote, setSelectedNote] = useState<Note | null>(null)
	const [selectedTags, setTagsSelected] = useState<Set<string>>(new Set('0'))
	const [isEditorEnabled, setIsEditorEnabled] = useState<boolean>(true)

	const handleTagsSelected = useCallback((id: string) => {
		setTagsSelected(prev => {
			if (id === '0') return new Set('0')
			const newSet = new Set(prev)
			newSet.delete('0')
			newSet.has(id) ? newSet.delete(id) : newSet.add(id)
			return newSet.size === 0 ? new Set('0') : newSet
		})
	}, [])

	const handleToggleIsEditorEnabled = useCallback(() => {
		setIsEditorEnabled(prev => !prev)
	}, [])

	const value = useMemo(
		() => ({
			selectedNote,
			handleNoteSelect: setSelectedNote,
			selectedTags,
			handleTagsSelected,
			isEditorEnabled,
			handleToggleIsEditorEnabled,
		}),
		[
			selectedNote,
			selectedTags,
			isEditorEnabled,
			handleTagsSelected,
			handleToggleIsEditorEnabled,
		]
	)

	return <EditorContext value={value}>{children}</EditorContext>
}

export const useEditor = () => {
	const context = useContext(EditorContext)
	if (!context)
		throw new Error('useEditor deve ser usado dentro de EditorProvider')
	return context
}

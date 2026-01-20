interface SharedColumns {
	id: string
	owner?: string
	createdAt: number
	updatedAt: number
	status: 'active' | 'trashed'
}

interface Note extends SharedColumns {
	title: string
	content: string
	isPinned: boolean
}

type UpdateNote = Partial<Note> & Pick<Note, 'id'>

interface Tag extends SharedColumns {
	title: string
}

type UpdateTag = Partial<Tag> & Pick<Tag, 'id'>

interface NoteTag extends Omit<SharedColumns, 'id' | 'status'> {
	note: string
	tag: string
}

interface Settings {
	key: string
	value: string | number | boolean
}

type IdentificatorOfRowAffected = Promise<string>
type IdentificatorsOfRowAffected = Promise<string[]>

export type {
	Note,
	UpdateNote,
	Tag,
	UpdateTag,
	NoteTag,
	Settings,
	IdentificatorOfRowAffected,
	IdentificatorsOfRowAffected,
}

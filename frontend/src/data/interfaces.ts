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

type Identificator = string
type IdentificatorOfRowAffected = Promise<Identificator>
type IdentificatorsOfRowAffected = Promise<Identificator[]>

type JSONIdentificator = { id: Identificator }

type JSONSyncData<T extends object, Name extends string> = {
	[K in Name]: {
		pushed: Identificator[]
		toPull: T[]
	}
}

export type {
	Note,
	UpdateNote,
	Tag,
	UpdateTag,
	NoteTag,
	Settings,
	IdentificatorOfRowAffected,
	IdentificatorsOfRowAffected,
	JSONIdentificator,
	JSONSyncData,
}

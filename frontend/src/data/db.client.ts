import Dexie, { type EntityTable } from 'dexie'
import type { Note, Tag, NoteTag, Settings } from './interfaces'

const IndexDB = new Dexie('db.note.me') as Dexie & {
	note: EntityTable<Note, 'id'>
	tag: EntityTable<Tag, 'id'>
	noteTag: EntityTable<NoteTag>
	settings: EntityTable<Settings, 'key'>
}

IndexDB.version(1).stores({
	note: 'id, title, status, createdAt, updatedAt',
	tag: 'id, title, status, createdAt, updatedAt',
	noteTag: '[note+tag], createdAt, updatedAt',
	settings: 'key',
})

export { IndexDB, type Note, type Tag, type NoteTag }

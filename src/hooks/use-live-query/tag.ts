import { IndexDB } from '@/data/db.client'
import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'

export function useLiveQueryTag() {
	const [noteIdToSearch, setNoteIdToSearch] = useState<string | null>(null)
	const handleNoteIdToSearch = (id: string | null) => setNoteIdToSearch(id)

	const tags = useLiveQuery(
		async () => await IndexDB.tag.where('status').equals('active').toArray(),
		[]
	)

	const tagsByNote = useLiveQuery(async () => {
		if (!noteIdToSearch) return []

		return IndexDB.transaction('r', [IndexDB.note, IndexDB.tag], async tx => {
			const notesActive = await tx.note
				.where('status')
				.equals('active')
				.primaryKeys()

			const noteTag = await tx.noteTag
				.where('note')
				.anyOf(notesActive)
				.and(item => item.note === noteIdToSearch)
				.toArray()

			return await tx.tag.bulkGet(noteTag.map(item => item.tag))
		})
	}, [noteIdToSearch])

	return {
		tags,
		tagsByNote,
		handleNoteIdToSearch,
	}
}

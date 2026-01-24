import { IndexDB } from '@/data/db.client'
import Dexie from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'

interface UseLiveQueryTagProps {
	searchTagByNoteId: string
}

export function useLiveQueryTag(props?: UseLiveQueryTagProps) {
	const { searchTagByNoteId } = props || {}

	const tags = useLiveQuery(
		async () => await IndexDB.tag.where('status').equals('active').toArray(),
		[]
	)

	const tagsByNote = useLiveQuery(async () => {
		if (!searchTagByNoteId) return []

		return IndexDB.transaction(
			'r',
			[IndexDB.tag, IndexDB.noteTag],
			async tx => {
				const noteTag = await tx.noteTag
					.where('[note+tag]')
					.between(
						[searchTagByNoteId, Dexie.minKey],
						[searchTagByNoteId, Dexie.maxKey]
					)
					.toArray()

				const tagIds = noteTag.map(item => item.tag)
				return await tx.tag.where('id').anyOf(tagIds).toArray()
			}
		)
	}, [searchTagByNoteId])

	return { tags, tagsByNote }
}

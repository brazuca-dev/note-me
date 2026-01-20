import Dexie from 'dexie'
import { IndexDB } from '@/data/db.client'
import { IdentificatorService, Status, TimeService } from '@/data/helper'

export function useLocalTag(owner?: string) {
	// -< Create a local tag
	const create = async (title: string) => {
		return await IndexDB.tag.add({
			id: IdentificatorService.generateId(),
			title,
			owner,
			status: Status.Active,
			...TimeService.getTimeColumns(),
		})
  }
	
	// -< Get a local tag
  const read = async () => {
    
	}

	// -< Update a local tag
	const update = async (id: string, title: string) => {
		const tagToUpdate = TimeService.upLastUpdateColumn({ title })
		return await IndexDB.tag.update(id, tagToUpdate)
	}

	// -< Delete a local tag
	const remove = async (id: string) => {
		return await IndexDB.transaction('rw', ['tag', 'noteTag'], async () => {
			await IndexDB.noteTag
				.where('[note+tag]')
				.between([Dexie.minKey, id], [Dexie.maxKey, id])
				.delete()
			await IndexDB.tag.delete(id)
		})
	}

	// -< Toggle a local tag on a note
	const toggleTagNote = async (noteId: string, tagId: string) => {
		const noteTag = IndexDB.noteTag
			.where('[note+tag]')
			.equals(`${noteId}-${tagId}`)

		if ((await noteTag.count()) > 0) return await noteTag.delete()

		return await IndexDB.noteTag.add({
			note: noteId,
			tag: tagId,
			owner,
			...TimeService.getTimeColumns(),
		})
	}

	return {
    createLocalTag: create,
		readLocalTag: read,
		updateLocalTag: update,
		removeLocalTag: remove,
		toggleLocalTagNote: toggleTagNote,
	}
}

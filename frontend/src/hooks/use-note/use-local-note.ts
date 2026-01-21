import { cleanObject } from '@/lib/utils'
import { IndexDB } from '@/data/db.client'
import type {
	IdentificatorOfRowAffected,
	IdentificatorsOfRowAffected,
	Note,
	UpdateNote,
} from '@/data/interfaces'
import { IdentificatorService, Status, TimeService } from '@/data/helper'

export function useLocalNote(owner?: string) {
	// >- Pull notes from remote storage
	const pull = async (notesToPull: Note[]): IdentificatorsOfRowAffected => {
		const rowsAffected = await IndexDB.note.bulkPut(notesToPull, {
			allKeys: true,
		})

		if (rowsAffected.length !== notesToPull.length)
			await IndexDB.note.bulkDelete(notesToPull.map(note => note.id))

		return rowsAffected
	}

	// -< Create a local note
	const create = async (): IdentificatorOfRowAffected => {
		return await IndexDB.note.add({
			id: IdentificatorService.generateId(),
			title: 'Give a title to your new note :)',
			content: '🌱 Sprout your ideias here!',
			isPinned: false,
			status: Status.Active,
			owner,
			...TimeService.getTimeColumns(),
		})
	}

	// >- Get a local note
	const read = async (id?: string, gteUpdatedAt?: number): Promise<Note[]> => {
		if (id) {
			const noteById = await IndexDB.note.get(id)
			return noteById ? [noteById] : []
		}

		if (gteUpdatedAt) {
			return await IndexDB.note
				.where('updatedAt')
				.aboveOrEqual(gteUpdatedAt)
				.and(note => note.status === 'active')
				.toArray()
		}
		return await IndexDB.note.where('status').equals('active').toArray()
	}

	// >- Update a local note
	const update = async (note: UpdateNote): IdentificatorOfRowAffected => {
		const noteCleaned = cleanObject(note)
		const noteToUpdate = TimeService.upLastUpdateColumn(noteCleaned)

		const rowsAffected = await IndexDB.note.update(note.id, noteToUpdate)
		return rowsAffected > 0 ? note.id : ''
	}

	// >- Delete a local note
	const remove = async (id: string): IdentificatorOfRowAffected => {
		await IndexDB.note.delete(id)
		const isNotFound = await IndexDB.note.where('id').equals(id).count()
		return isNotFound <= 0 ? id : ''
	}

	return {
		createLocalNote: create,
		updateLocalNote: update,
		readLocalNote: read,
		deleteLocalNote: remove,
		pullNotesFromRemote: pull,
	}
}

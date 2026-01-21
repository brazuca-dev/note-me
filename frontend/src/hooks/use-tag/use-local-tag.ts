import { IndexDB } from '@/data/db.client'
import { cleanObject } from '@/lib/utils'
import { IdentificatorService, Status, TimeService } from '@/data/helper'
import type {
	IdentificatorOfRowAffected,
	IdentificatorsOfRowAffected,
	Tag,
	UpdateTag,
} from '@/data/interfaces'

export function useLocalTag(owner?: string) {
	// >- Pull tags from remote storage
	const pull = async (tagsToPull: Tag[]): IdentificatorsOfRowAffected => {
		const rowsAffected = await IndexDB.tag.bulkPut(tagsToPull, {
			allKeys: true,
		})

		if (rowsAffected.length !== tagsToPull.length)
			await IndexDB.note.bulkDelete(tagsToPull.map(note => note.id))

		return rowsAffected
	}

	// -< Create a local tag
	const create = async (title: string): IdentificatorOfRowAffected => {
		return await IndexDB.tag.add({
			id: IdentificatorService.generateId(),
			title,
			owner,
			status: Status.Active,
			...TimeService.getTimeColumns(),
		})
	}

	// -< Get a local tag
	const read = async (id?: string, gteUpdatedAt?: number) => {
		if (id) {
			const tagById = await IndexDB.tag.get(id)
			return tagById ? [tagById] : []
		}

		if (gteUpdatedAt) {
			return await IndexDB.tag
				.where('updatedAt')
				.aboveOrEqual(gteUpdatedAt)
				.and(tag => tag.status === 'active')
				.toArray()
		}
		return await IndexDB.tag.where('status').equals('active').toArray()
	}

	// -< Update a local tag
	const update = async (tag: UpdateTag): IdentificatorOfRowAffected => {
		const tagCleaned = cleanObject(tag)
		const tagToUpdate = TimeService.upLastUpdateColumn(tagCleaned)

		const rowsAffected = await IndexDB.tag.update(tag.id, tagToUpdate)
		return rowsAffected > 0 ? tag.id : ''
	}

	// -< Delete a local tag
	const toTrash = async (id: string): IdentificatorOfRowAffected =>
		await update({ id, status: Status.Trashed })

	const recycle = async (id: string): IdentificatorOfRowAffected =>
		await update({ id, status: Status.Active })

	// -< Toggle a local tag on a note
	const toggleTagNote = async (
		noteId: string,
		tagId: string
	): IdentificatorOfRowAffected => {
		let rowsAffected = 0

		const noteTag = IndexDB.noteTag
			.where('[note+tag]')
			.equals(`${noteId}-${tagId}`)

		if ((await noteTag.count()) > 0) {
			rowsAffected = await noteTag.delete()
			return rowsAffected > 0 ? `${noteId}-${tagId}` : ''
		}

		rowsAffected = await IndexDB.noteTag.add({
			note: noteId,
			tag: tagId,
			owner,
			...TimeService.getTimeColumns(),
		})
		return rowsAffected > 0 ? `${noteId}-${tagId}` : ''
	}

	return {
		pullTagsFromRemote: pull,
		createLocalTag: create,
		readLocalTag: read,
		updateLocalTag: update,
		toTrashLocalTag: toTrash,
		recycleLocalTag: recycle,
		toggleLocalTagNote: toggleTagNote,
	}
}

import type {
	IdentificatorOfRowAffected,
	JSONIdentificator,
	JSONSyncData,
	Tag,
	UpdateTag,
} from '@/data/interfaces'
import { useAuthFetch } from '../use-auth-fetch'
import { Status } from '@/data/helper'

export function useRemoteTag() {
	const fetch = useAuthFetch(`${import.meta.env.VITE_API_PROXY}/tag`)

	// -< Push local tags to remote storage
	const push = async (tagsToPush: Tag[], lastSync: number): Promise<Tag[]> => {
		const response = await fetch({
			subUrl: `/sync/${lastSync}`,
			method: 'PUT',
			body: JSON.stringify({ tags: tagsToPush }),
		})

		if (!response.ok)
			throw new Error('Failed to push local tags to remote storage')
		const { status, data, message } =
			await response.json<JSONSyncData<Tag, 'tag'>>()

		if (status !== 201) throw new Error(message)
		return data.tag.toPull
	}

	// -< Create a remote tag
	const create = async (tag: Tag): IdentificatorOfRowAffected => {
		const response = await fetch({
			method: 'POST',
			body: JSON.stringify(tag),
		})

		if (!response.ok) throw new Error('Failed to create remote tag')
		const { status, data, message } = await response.json<JSONIdentificator>()

		if (status !== 201) throw new Error(message)
		return data.id
	}

	// -< Update a remote tag
	const update = async (tag: UpdateTag): IdentificatorOfRowAffected => {
		const response = await fetch({
			subUrl: `/${tag.id}`,
			method: 'PATCH',
			body: JSON.stringify(tag),
		})

		if (!response.ok) throw new Error('Failed to update remote tag')
		const { status, data, message } = await response.json<JSONIdentificator>()

		if (status !== 200) throw new Error(message)
		return data.id
	}

	// -< Delete a remote tag
	const toTrash = async (id: string): IdentificatorOfRowAffected =>
		await update({ id, status: Status.Trashed })

	const recycle = async (id: string): IdentificatorOfRowAffected =>
		await update({ id, status: Status.Active })

	// -< Toggle a note's tag status
	const toggleTagNote = async (tagId: string, noteId: string) => {
		const response = await fetch({
			subUrl: `/${tagId}/notes/${noteId}`,
			method: 'PUT',
		})

		if (!response.ok) throw new Error('Failed to toggle tag note')
		const { status, data, message } = await response.json<JSONIdentificator>()

		if (status !== 200) throw new Error(message)
		return data.id
	}

	return {
		pushTagsToRemote: push,
		createRemoteTag: create,
		updateRemoteTag: update,
		recycleRemoteTag: recycle,
		toTrashRemoteTag: toTrash,
		toggleRemoteTagNote: toggleTagNote,
	}
}

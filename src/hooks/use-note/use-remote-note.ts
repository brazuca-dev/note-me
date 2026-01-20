import type {
	IdentificatorOfRowAffected,
	Note,
	UpdateNote,
} from '@/data/interfaces'
import { useFetch } from '../utils/use-fetch'
import { cleanObject } from '@/lib/utils'

// -< Possible json responses from remote storage
type JsonNoteId = { id: string }
type JsonNotesToPull = { notes: Note[] }

export function useRemoteNote() {
	const fetch = useFetch(`${import.meta.env.VITE_API_PROXY}/note`)

	// >- Push local notes to remote storage
	const push = async (
		notesToPush: Note[],
		lastSync: number
	): Promise<Note[]> => {
		const response = await fetch({
			method: 'PUT',
			subUrl: `/sync/${lastSync}`,
			body: JSON.stringify({ notes: notesToPush }),
		})

		if (!response.ok) throw new Error('Failed to push notes to remote storage')
		const { data, status, message } = await response.json<JsonNotesToPull>()

		if (status !== 200) throw new Error(message)
		return data.notes
	}

	// -< Create a remote note
	const create = async (note: Note): IdentificatorOfRowAffected => {
		const response = await fetch({
			method: 'POST',
			body: JSON.stringify(note),
		})

		if (!response.ok) throw new Error('Failed to create remote note')
		const { status, data, message } = await response.json<JsonNoteId>()

		if (status !== 201) throw new Error(message)
		return data.id
	}

	// -< Update a remote note
	const update = async (note: UpdateNote): IdentificatorOfRowAffected => {
		const noteCleaned = cleanObject(note)

		const response = await fetch({
			method: 'PATCH',
			subUrl: `/${noteCleaned.id}`,
			body: JSON.stringify(noteCleaned),
		})

		if (!response.ok) throw new Error('Failed to update note')
		const { status, data, message } = await response.json<JsonNoteId>()

		if (status !== 200) throw new Error(message)
		return data.id
	}

	// -< Remove a remote note
	const remove = async (id: string): IdentificatorOfRowAffected => {
		const response = await fetch({
			method: 'DELETE',
			subUrl: `/${id}`,
		})

		if (!response.ok) throw new Error('Failed to remove note')
		const { status, data, message } = await response.json<JsonNoteId>()

		if (status !== 200) throw new Error(message)
		return data.id
	}

	return {
		pushNotesToRemote: push,
		createRemoteNote: create,
		updateRemoteNote: update,
		deleteRemoteNote: remove,
	}
}

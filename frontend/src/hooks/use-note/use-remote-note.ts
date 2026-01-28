import type {
	IdentificatorOfRowAffected,
	JSONIdentificator,
	JSONSyncData,
	Note,
	UpdateNote,
} from '@/data/interfaces'
import { useAuthFetch } from '../use-auth-fetch'
import { cleanObject } from '@/lib/utils'

export function useRemoteNote() {
	const fetch = useAuthFetch(`${import.meta.env.VITE_API_PROXY}/note`)

	// >- Push local notes to remote storage
	const push = async (
		notesToPush: Note[],
		lastSync: number
  ): Promise<Note[]> => {
		const response = await fetch({
			method: 'PUT',
			subUrl: `/sync/${lastSync}`,
			body: JSON.stringify(notesToPush),
		})

    const { data, message } = await response.json<JSONSyncData<Note, 'notes'>>()
		
    if (!response.ok) throw new Error(message)
    console.log(data)
		return data.notes.toPull
	}

	// -< Create a remote note
	const create = async (note: Note): IdentificatorOfRowAffected => {
		console.log('Creating remote note...', note)

		const response = await fetch({
			method: 'POST',
			body: JSON.stringify(note),
		})

		if (!response.ok) throw new Error('Failed to create remote note')
		const { status, data, message } = await response.json<JSONIdentificator>()

		if (status !== 201) throw new Error(message)
		return data.id
	}

	// -< Update a remote note
	const update = async (note: UpdateNote): IdentificatorOfRowAffected => {
		const noteCleaned = cleanObject(note)

		const response = await fetch({
			method: 'PATCH',
			body: JSON.stringify(noteCleaned),
		})

		if (!response.ok) throw new Error('Failed to update note')
		const { status, data, message } = await response.json<JSONIdentificator>()

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
		const { status, data, message } = await response.json<JSONIdentificator>()

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

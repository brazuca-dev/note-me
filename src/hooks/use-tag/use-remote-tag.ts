import type { Tag } from '@/data/interfaces'
import { useFetch } from '../utils/use-fetch'
import { useLocalTag } from './use-local-tag'

// -< Possible json responses from remote storage
type JsonTagId = { id: string }
type JsonTagToPull = { tags: Tag[] }

export function useRemoteTag() {
	const {} = useLocalTag()
	const fetch = useFetch(`${import.meta.env.VITE_API_PROXY}/tag`)

	// -< Push local tags to remote storage
	const push = async (tagsToPush: Tag[], lastSync: number) => {
    const response = await fetch({
      subUrl: `/sync/${lastSync}`,
			method: 'PUT',
			body: JSON.stringify({tags: tagsToPush}),
		})
		
		if (!response.ok) throw new Error('Failed to push local tags to remote storage')
		const { status, data, message } = await response.json<JsonTagToPull>()
		
		if (status !== 201) throw new Error(message)
		return data.tags
	}
	
	// -< Create a remote tag
  const create = async (tag: Tag) => {
    const response = await fetch({
      method: 'POST',
      body: JSON.stringify(tag),
    })
      
    if (!response.ok) throw new Error('Failed to create remote tag')
    const { status, data, message } = await response.json<JsonTagId>()
  
		if (status !== 201) throw new Error(message)
		return data.id
	}

  // -< Update a remote tag
	const update = async (tag: Tag) => {
    const response = await fetch({
      subUrl: `/${tag.id}`,
			method: 'PUT',
			body: JSON.stringify(tag),
		})
		
		if (!response.ok) throw new Error('Failed to update remote tag')
		const { status, data, message } = await response.json<JsonTagId>()
		
		if (status !== 200) throw new Error(message)
		return data.id
	}

	// -< Delete a remote tag
	const remove = async () => {}

	const toggleTagNote = async (tagId: string, noteId: string) => {
		const response = await fetch({
			subUrl: `/${tagId}/notes/${noteId}`,
			method: 'PUT',
		})

		if (!response.ok) throw new Error('Failed to toggle tag note')
		const { status, data, message } = await response.json<JsonTagId>()

		if (status !== 200) throw new Error(message)
		return data.id
	}
	
  return {
    pushNotesToRemote: push,
		createRemoteTag: create,
		updateRemoteTag: update,
		removeRemoteTag: remove,
	}
}

import type { UpdateTag } from '@/data/interfaces'
import { useLocalTag } from './use-local-tag'
import { useRemoteTag } from './use-remote-tag'
import { useAuth } from '@clerk/clerk-react'
import { sync, type SyncResponse } from '@/lib/sync-response'
import { SyncService } from '@/data/helper'

export function useTag() {
	const { userId, isSignedIn } = useAuth()
	const {
		createLocalTag,
		readLocalTag,
		updateLocalTag,
		toTrashLocalTag,
		recycleLocalTag,
		toggleLocalTagNote,
		pullTagsFromRemote,
	} = useLocalTag(userId || undefined)
	const {
		createRemoteTag,
		updateRemoteTag,
		toTrashRemoteTag,
		recycleRemoteTag,
		toggleRemoteTagNote,
		pushTagsToRemote,
	} = useRemoteTag()

	const syncTagsProcedure = async (): Promise<SyncResponse> => {
		try {
			if (!isSignedIn) return sync.failed()
			const lastSync = await SyncService.getLastSync()

			const tagsToPush = await readLocalTag(undefined, lastSync)

			const tagsToPull = await pushTagsToRemote(tagsToPush, lastSync)
			const tagsPulled = await pullTagsFromRemote(tagsToPull)

			return sync.both({
				isRemoteSynced: tagsToPull.length > 0,
				isLocalSynced: tagsPulled.length > 0,
			})
		} catch (_) {
			return sync.failed()
		}
	}

	const create = async (title: string): Promise<SyncResponse> => {
		try {
			const tagId = await createLocalTag(title)
			const isLocalSynced = tagId !== null

			if (!isSignedIn) return sync.local(isLocalSynced)

			const [tagCreated] = await readLocalTag(tagId)
			const isRemoteSynced = !!(await createRemoteTag(tagCreated))

			return sync.both({ isRemoteSynced, isLocalSynced })
		} catch (_) {
			return sync.failed()
		}
	}

	const update = async (tag: UpdateTag): Promise<SyncResponse> => {
		try {
			const isLocalSynced = !!(await updateLocalTag(tag))
			if (!isSignedIn) return sync.local(isLocalSynced)

			const isRemoteSynced = !!(await updateRemoteTag(tag))
			return sync.both({ isRemoteSynced, isLocalSynced })
		} catch (_) {
			return sync.failed()
		}
	}

	const toTrash = async (id: string) => {
		try {
			const isLocalSynced = !!(await toTrashLocalTag(id))
			if (!isSignedIn) return sync.local(isLocalSynced)

			const isRemoteSynced = !!(await toTrashRemoteTag(id))
			return sync.both({ isRemoteSynced, isLocalSynced })
		} catch (_) {
			return sync.failed()
		}
	}

	const recycle = async (id: string) => {
		try {
			const isLocalSynced = !!(await recycleLocalTag(id))
			if (!isSignedIn) return sync.local(isLocalSynced)

			const isRemoteSynced = !!(await recycleRemoteTag(id))
			return sync.both({ isRemoteSynced, isLocalSynced })
		} catch (_) {
			return sync.failed()
		}
	}

	const toggleTagNote = async (noteId: string, tagId: string) => {
		try {
			const isLocalSynced = !!(await toggleLocalTagNote(noteId, tagId))
			if (!isSignedIn) return sync.local(isLocalSynced)

			const isRemoteSynced = !!(await toggleRemoteTagNote(noteId, tagId))
			return sync.both({ isRemoteSynced, isLocalSynced })
		} catch (_) {
			return sync.failed()
		}
	}

	return {
		syncTagsProcedure,
		createTag: create,
		updateTag: update,
		toTrashTag: toTrash,
		recycleTag: recycle,
		toggleTagNote,
	}
}

import type { Tag, UpdateTag } from '@/data/interfaces'
import { useLocalTag } from './use-local-tag'
import { useRemoteTag } from './use-remote-tag'
import { useAuth } from '@clerk/clerk-react'
import { sync, type SyncResponse } from '@/lib/utils'

export function useTag() {
	const { userId, isSignedIn } = useAuth()
	const { createLocalTag } = useLocalTag(userId || undefined)
	const { createRemoteTag } = useRemoteTag()

	const syncTagsProcedure = async () => {}

	const create = async (title: string): Promise<SyncResponse> => {
		try {
			const isLocalSynced = !!(await createLocalTag(title))
			if (!isSignedIn) return sync.local(isLocalSynced)

			const isRemoteSynced = !!(await createRemoteTag())
			return sync.both({ isRemoteSynced, isLocalSynced })
		} catch (_) {
			return sync.failed()
		}
	}

	const update = async (tag: UpdateTag) => {}

	const remove = async () => {}

	const toggleTagNote = async () => {}

	return {
		createTag: create,
		updateTag: update,
		removeTag: remove,
		toggleTagNote,
	}
}

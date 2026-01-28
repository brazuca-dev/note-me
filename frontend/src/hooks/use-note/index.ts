import type { UpdateNote } from '@/data/interfaces'
import { useAuth } from '@clerk/clerk-react'
import { useLocalNote } from './use-local-note'
import { useRemoteNote } from './use-remote-note'
import { Status, SyncService } from '@/data/helper'
import { type SyncResponse, sync } from '@/lib/sync-response'
import { notify } from '@/lib/notify'
import { getErrorMessage } from '@/lib/utils'

export function useNote() {
	const { userId, isSignedIn } = useAuth()
	const {
		createLocalNote,
		readLocalNote,
		updateLocalNote,
		pullNotesFromRemote,
	} = useLocalNote(userId || undefined)
	const { createRemoteNote, updateRemoteNote, pushNotesToRemote } =
		useRemoteNote()

	const syncNotesProcedure = async (): Promise<SyncResponse> => {
		try {
			if (!isSignedIn) return sync.failed()
			const lastSync = await SyncService.getLastSync()

			const notesToPush = await readLocalNote(undefined, lastSync)

			const notesToPull = await pushNotesToRemote(notesToPush, lastSync)
			const notesPulled = await pullNotesFromRemote(notesToPull)

			return sync.both({
				isRemoteSynced: notesToPull.length > 0,
				isLocalSynced: notesPulled.length > 0,
			})
    } catch (err) {
      console.error(err)
			return sync.failed()
		}
	}

	const createNote = async (): Promise<SyncResponse> => {
		try {
			const noteId = await createLocalNote()
			const isLocalSynced = noteId !== null

			if (!isSignedIn) return sync.local(isLocalSynced)

			const [noteCreated] = await readLocalNote(noteId)
			const isRemoteSynced = !!(await createRemoteNote(noteCreated))

			return sync.both({ isRemoteSynced, isLocalSynced })
		} catch (_) {
			return sync.failed()
		}
	}

	const updateNote = async (note: UpdateNote): Promise<SyncResponse> => {
		try {
			const isLocalSynced = !!(await updateLocalNote(note))
			if (!isSignedIn) return sync.local(isLocalSynced)

			const [localNote] = await readLocalNote(note.id)
			const isRemoteSynced = !!(await updateRemoteNote(localNote))

			return sync.both({ isRemoteSynced, isLocalSynced })
		} catch (_) {
			return sync.failed()
		}
	}

	const toggleIsPinned = async (
		id: string,
		actualIsPinned: boolean
	): Promise<SyncResponse> =>
		await updateNote({ id, isPinned: !actualIsPinned })

	const toggleIsTrashed = async (
		id: string,
		actualStatus: 'active' | 'trashed'
	): Promise<SyncResponse> =>
		await updateNote({
			id,
			status: actualStatus === Status.Active ? Status.Trashed : Status.Active,
		})

	return {
		syncNotesProcedure,
		createNote,
		updateNote,
		toggleIsPinned,
		toggleIsTrashed,
	}
}

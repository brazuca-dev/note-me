import type { UpdateNote } from '@/data/interfaces'
import { useAuth } from '@clerk/clerk-react'
import { useLocalNote } from './use-local-note'
import { useRemoteNote } from './use-remote-note'
import { SyncService } from '@/data/helper'
import { type SyncResponse, sync } from '@/lib/sync-response'

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
		} catch (_) {
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

			const isRemoteSynced = !!(await updateRemoteNote(note))
			return sync.both({ isRemoteSynced, isLocalSynced })
		} catch (_) {
			return sync.failed()
		}
	}

	const toggleIsPinned = async (id: string): Promise<SyncResponse> => {
		try {
			const [localNote] = await readLocalNote(id)
			if (!localNote)
				throw new Error(`Note ${id} not found while trying to toggle isPinned`)

			const noteWithPinnedToggled: UpdateNote = {
				...localNote,
				isPinned: !localNote.isPinned,
			}
			return await updateNote(noteWithPinnedToggled)
		} catch (_) {
			return sync.failed()
		}
	}

	const toggleIsTrashed = async (id: string): Promise<SyncResponse> => {
		try {
			const [localNote] = await readLocalNote(id)
			if (!localNote)
				throw new Error(`Note ${id} not found while trying to toggle isTrashed`)

			const noteWithStatusToggled: UpdateNote = {
				...localNote,
				status: localNote.status === 'active' ? 'trashed' : 'active',
			}
			return (await updateNote(noteWithStatusToggled)) || [false, false]
		} catch (_) {
			return sync.failed()
		}
	}

	return {
		syncNotesProcedure,
		createNote,
		updateNote,
		toggleIsPinned,
		toggleIsTrashed,
	}
}

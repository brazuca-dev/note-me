import { notify, type NotifyOptions } from '@/lib/notify'
import { useNote } from './use-note'
import { SyncService } from '@/data/helper'

export function useSyncData(): () => Promise<void> {
	const { syncNotesProcedure } = useNote()

	const syncProcedure = async (): Promise<void> => {
		const [isRemoteSynced, isLocalSynced] = await syncNotesProcedure()

		const isRemoteSyncedNotify: NotifyOptions = {
			type: isRemoteSynced ? 'success' : 'error',
			message: isRemoteSynced ? 'Remote sync completed' : 'Remote sync failed',
			description: isRemoteSynced
				? 'Your environment is now synced'
				: 'Your environment is now out of sync',
		}
		notify(isRemoteSyncedNotify)

		const isLocalSyncedNotify: NotifyOptions = {
			type: isLocalSynced ? 'success' : 'error',
			message: isLocalSynced ? 'Local sync completed' : 'Local sync failed',
			description: isLocalSynced
				? 'Your environment is now synced'
				: 'Your environment is now out of sync',
		}
		notify(isLocalSyncedNotify)

    if (isRemoteSynced || isLocalSynced) SyncService.setLastSync(Date.now())
	}

	return async (): Promise<void> => {
		if (await SyncService.isSyncNeeded()) syncProcedure()
	}
}

import { nanoid } from 'nanoid'
import { IndexDB } from './db.client'

export const SyncService = {
	async setLastSync(timestamp: number): Promise<void> {
		await IndexDB.settings.put({ key: 'last_sync_at', value: timestamp })
	},

	async getLastSync(): Promise<number> {
		const config = await IndexDB.settings.get('last_sync_at')
		return (config?.value as number) ?? 0
	},

	async isSyncNeeded(): Promise<boolean> {
		const lastSync = await SyncService.getLastSync()
		const now = Date.now()
		return now - lastSync > 1_800_000 // meia hora em milissegundos
	},
}

export const TimeService = {
	getTimeColumns: () => ({
		createdAt: Date.now(),
		updatedAt: Date.now(),
	}),
	upLastUpdateColumn: <T extends object>(row: T) => ({
		...row,
		updatedAt: Date.now(),
	}),
}

export const IdentificatorService = {
	generateId: () => nanoid(),
}

export enum Status {
	Active = 'active',
	Trashed = 'trashed',
}

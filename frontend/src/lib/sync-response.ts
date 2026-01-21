export type SyncResponse = [isRemoteSynced: boolean, isLocalSynced: boolean]

const onlyLocalSynced = (isLocalSynced: boolean): SyncResponse => [
	false,
	isLocalSynced,
]
const syncedBoth = ({
	isRemoteSynced,
	isLocalSynced,
}: {
	isRemoteSynced: boolean
	isLocalSynced: boolean
}): SyncResponse => [isRemoteSynced, isLocalSynced]
const syncFailed = (): SyncResponse => [false, false]

export const sync = {
	local: onlyLocalSynced,
	both: syncedBoth,
	failed: syncFailed,
}

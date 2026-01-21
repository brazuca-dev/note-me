import type { InferSelectModel, Table } from 'drizzle-orm'

type Identificator = string
type IdentificatorOfRowAffected = Promise<Identificator>

type Identificators = { id: Identificator }[]
type IdentificatorOfRowsAffected = Promise<Identificators>

type CompoundIdentificatorsOfRowAffected<P extends object> = Promise<{
	[K in keyof P]: Identificator
}>

type BaseRow<T extends Table> = InferSelectModel<T>
type RowCollection<T extends Table> = Promise<BaseRow<T>[]>

type DataSync<T extends Table> = Promise<{
	data: {
		pushed: Identificators
		toPull: BaseRow<T>[]
	}
}>

export type {
	IdentificatorOfRowAffected,
	IdentificatorOfRowsAffected,
	CompoundIdentificatorsOfRowAffected,
	RowCollection,
	DataSync,
}

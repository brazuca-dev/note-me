import {
	type ComponentType,
	type PropsWithChildren,
	type ReactNode,
} from 'react'

interface ShowProps {
	fallback?: ReactNode
	children: ReactNode
	condition: boolean
}

export function Show({ condition, fallback = <></>, children }: ShowProps) {
	return condition ? children : fallback
}

interface ForProps<T> {
	each: T[] | undefined
	children: (item: T, index: number) => ReactNode
}

export function For<T>({ each, children }: ForProps<T>) {
	return <>{each?.map(children)}</>
}

interface ComposeProps {
	providers: ComponentType<PropsWithChildren<any>>[]
	children: ReactNode
}

export function Compose({ providers, children }: ComposeProps) {
	return (
		<>
			{providers.reduce((acc, Provider) => {
				return <Provider>{acc}</Provider>
			}, children)}
		</>
	)
}

import {
	createContext,
	useContext,
	useState,
	useCallback,
	type ReactElement,
	useMemo,
} from 'react'
import { useDebounce } from '@/hooks/use-debounce'

interface SearchContextProps {
	query: string
	handleQueryChange: (newQuery: string) => void
}

const SearchContext = createContext<SearchContextProps | null>(null)

export const SearchProvider = ({ children }: { children: ReactElement }) => {
	const [query, setQuery] = useState<string>('')

	const debouncedQueryUpdater = useDebounce((newQuery: string) => {
		setQuery(newQuery.trim())
	}, 500)

	const handleQueryChange = useCallback(
		(newQuery: string) => {
			debouncedQueryUpdater(newQuery)
		},
		[debouncedQueryUpdater]
	)

	const value = useMemo(
		() => ({ query, handleQueryChange }),
		[query, handleQueryChange]
	)

	return (
		<SearchContext.Provider value={value}>{children}</SearchContext.Provider>
	)
}

export const useSearch = () => {
	const context = useContext(SearchContext)
	if (!context)
		throw new Error('useSearch deve ser usado dentro de SearchProvider')
	return context
}

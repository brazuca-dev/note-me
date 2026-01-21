import { Input } from '@/components/ui/input'
import Search from 'lucide-react/dist/esm/icons/search'
import { useSearch } from '@/global/context/search-context'

export function NoteSearch() {
	const { handleQueryChange } = useSearch()

	return (
		<div className='relative'>
			<Input
				type='search'
				placeholder='Find your notes by title...'
				className='w-full mt-2 h-10.5 pr-11 text-lg'
				onChange={e => handleQueryChange(e.target.value)}
			/>
			<Search className='pointer-events-none size-4.5 absolute top-1/2 -translate-y-1/2 right-4 mt-1' />
		</div>
	)
}

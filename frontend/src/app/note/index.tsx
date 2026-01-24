import NotebookText from 'lucide-react/dist/esm/icons/notebook-text'
import { NewNote } from './new-note'
import { NoteList } from './note-list'
import { ErrorBoundary } from 'react-error-boundary'

const Fallback = () => (
 	<div className='flex flex-col items-center justify-center gap-2 h-full opacity-50'>
		<span className='font-semibold text-lg'>Canno't load notes :/</span>
	</div>
)
    
export function MyNotes() {
	return (
		<>
			<div className='flex items-center justify-between mb-1 mx-1'>
				<h4 className='flex items-center gap-2'>
					<NotebookText className='size-5' /> Your notes
				</h4>
				<NewNote size='sm' />
			</div>

      <ErrorBoundary fallback={<Fallback />}>
        <NoteList />
			</ErrorBoundary>
		</>
	)
}

import NotebookText from 'lucide-react/dist/esm/icons/notebook-text'
import { NewNote } from './new-note'
import { NoteList } from './note-list'

export function MyNotes() {
	return (
		<>
			<div className='flex items-center justify-between mb-1 mx-1'>
				<h4 className='flex items-center gap-2'>
					<NotebookText className='size-5' /> Your notes
				</h4>
				<NewNote size='sm' />
			</div>

			<NoteList />
		</>
	)
}

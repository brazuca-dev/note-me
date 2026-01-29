import { useEditor } from '@/global/context/editor-context'
import { useNote } from '@/hooks/use-note'
import { useDownloadNote } from '@/hooks/use-download-note'
import { useAuth } from '@clerk/clerk-react'
import CloudOff from 'lucide-react/dist/esm/icons/cloud-off'
import Download from 'lucide-react/dist/esm/icons/download'
import Eye from 'lucide-react/dist/esm/icons/eye'
import PenBox from 'lucide-react/dist/esm/icons/pen-box'
import Save from 'lucide-react/dist/esm/icons/save'
import Cloud from 'lucide-react/dist/esm/icons/cloud'
import { PinIcon } from '@/components/icons/pin'
import { Button } from '@/components/ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { useSave } from '@/global/context/save-context'

export function Tools() {
	const { selectedNote, isEditorEnabled, handleToggleIsEditorEnabled } =
		useEditor()

	if (!selectedNote) return <></>

	const { isSaved, isSaving } = useSave()
	const { isSignedIn } = useAuth()
	const { toggleIsPinned } = useNote()
	const { downloadNote, hasDownloaded } = useDownloadNote(selectedNote)

	return (
		<div className='md:m-0 md:ml-auto space-x-2 md:pr-4 fixed bottom-0 right-0 mr-4 mb-6 md:static'>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						size='icon'
						variant='outline'
						onClick={() => toggleIsPinned(selectedNote.id, selectedNote.isPinned)}
					>
						<PinIcon variant={selectedNote?.isPinned ? 'filled' : 'outline'} />
					</Button>
				</TooltipTrigger>
				<TooltipContent className='font-semibold text-sm'>
					Pin your note
				</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						size='icon'
						variant='outline'
						onClick={handleToggleIsEditorEnabled}
					>
						{isEditorEnabled ? <PenBox /> : <Eye />}
					</Button>
				</TooltipTrigger>
				<TooltipContent className='font-semibold text-sm'>
					Edit mode
				</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						size='icon'
						variant='outline'
						onClick={downloadNote}
						data-downloaded={hasDownloaded || 'null'}
						className='data-[downloaded=true]:bg-primary data-[downloaded=true]:dark:bg-primary data-[downloaded=false]:bg-destructive data-[downloaded=false]:dark:bg-destructive data-[downloaded=null]:text-primary text-primary-foreground duration-400 transition-all'
					>
						<Download />
					</Button>
				</TooltipTrigger>
				<TooltipContent className='font-semibold text-sm'>
					Download it!
				</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						size='icon'
						variant='secondary'
						data-saving={isSaving}
						aria-label='local save'
						data-save={isSaved.localSaved}
						className='data-[saving=true]:animate-pulse data-[save=true]:bg-primary data-[save=true]:text-primary-foreground data-[save=false]:bg-destructive data-[save=false]:text-primary-foreground transition-colors duration-400 md:ml-4 ml-2'
					>
						<Save />
					</Button>
				</TooltipTrigger>
				<TooltipContent className='font-semibold text-sm'>
					Notice when your note has saved locally
				</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						size='icon'
						variant='secondary'
						data-saving={isSaving}
						data-issignedin={isSignedIn}
						data-save={isSaved.remoteSaved}
						className='data-[saving=true]:animate-pulse data-[save=true]:bg-primary data-[save=true]:text-primary-foreground data-[save=false]:bg-destructive data-[save=false]:text-primary-foreground transition-colors duration-400 data-[issignedin=false]:opacity-65'
					>
						{isSignedIn ? <Cloud /> : <CloudOff />}
					</Button>
				</TooltipTrigger>
				<TooltipContent className='font-semibold text-sm'>
					{!isSignedIn && "Can't sync within cloud :/"}
					{isSignedIn && 'Notice when your note has saved remotely'}
				</TooltipContent>
			</Tooltip>
		</div>
	)
}

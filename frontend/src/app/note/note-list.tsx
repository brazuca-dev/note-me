import { ScrollArea } from '@/components/ui/scroll-area'
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import { NotePeek } from './note-peek'
import { For, Show } from '@/components/utils'
import { isEmpty } from '@/lib/utils'
import { useLiveQueryNote } from '@/hooks/use-live-query/note'

export function Fallback() {
	return (
		<div className='flex flex-col items-center justify-center gap-2 h-full opacity-50'>
			<span className='font-semibold text-lg'>Nothing to here for now...</span>
		</div>
	)
}

export function NoteList() {
	const notes = useLiveQueryNote()

	return (
		<Show condition={!isEmpty(notes)} fallback={<Fallback />}>
			<ScrollArea className='flex-1 min-h-0'>
				<SidebarMenu className='space-y-2 pr-3'>
					<For each={notes}>
						{note => (
							<SidebarMenuItem key={note.id}>
								<NotePeek note={note} />
							</SidebarMenuItem>
						)}
					</For>
				</SidebarMenu>
			</ScrollArea>
		</Show>
	)
}

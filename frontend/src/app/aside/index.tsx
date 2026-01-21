import { Logo } from '@/components/logo'
import { MyNotes } from '../note'
import { NoteSearch } from '../note/note-search'
import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'
import { MyTags } from '../tags'
import { Separator } from '@/components/ui/separator'
import { UserAccount } from './user-account'

export function Aside() {
	return (
		<Sidebar className='p-2 *:bg-background bg-background'>
			<SidebarHeader>
				<div className='bg-card rounded-md ring ring-foreground/15 flex items-center justify-between p-3.5'>
					<Logo />
					<UserAccount />
				</div>
				<NoteSearch />
			</SidebarHeader>

			<SidebarContent className='flex flex-col flex-1 gap-2 min-h-0 mt-4 px-2 pl-4'>
				<MyTags />
				<Separator className='my-3' />
				<MyNotes />
			</SidebarContent>
		</Sidebar>
	)
}

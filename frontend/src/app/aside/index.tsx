import { Logo } from '@/components/logo'
import { MyNotes } from '../note'
import { NoteSearch } from '../note/note-search'
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail, useSidebar,  } from '@/components/ui/sidebar'
import { MyTags } from '../tags'
import { Separator } from '@/components/ui/separator'
import { UserAccount } from './user-account'
import { Button } from '@/components/ui/button'
import SidebarClose from 'lucide-react/dist/esm/icons/sidebar-close'
import SidebarOpen from 'lucide-react/dist/esm/icons/sidebar-open'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Aside() {
  const { open, setOpen, toggleSidebar, isMobile } = useSidebar()
    
  if (isMobile) return (
    <Sheet open={open} onOpenChange={setOpen} defaultOpen={true}>
      <SheetTrigger asChild>
        <Button variant="outline" className='absolute top-1/2 -left-2 z-50'>
          <SidebarOpen />
        </Button>
      </SheetTrigger>
          
      <SheetContent side='left' className='w-11/12' showCloseButton={false}>
        <SheetHeader>
          <div className='p-3.5 bg-card rounded-md ring ring-foreground/15 flex items-center justify-between'>
					<Logo />
  					<UserAccount />
  				</div>
  				<NoteSearch />
        </SheetHeader>
        
        <div className='flex flex-col flex-1 gap-2 min-h-0 px-2 pl-4'>   
          <MyTags />
  				<Separator className='my-3' />
  				<MyNotes />
        </div>
      </SheetContent>
    </Sheet>
  )
    
	return (
    <Sidebar side='left' collapsible='offcanvas' className='p-2 *:bg-background bg-background'>
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
			
      <SidebarRail className='absolute'>
        <Button variant='secondary' size='icon' className='absolute top-1/2' onClick={toggleSidebar}>
          <SidebarClose />
        </Button>
      </SidebarRail>
		</Sidebar>
	)
}

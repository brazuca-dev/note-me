import X from 'lucide-react/dist/esm/icons/x'
import { lazy } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Show } from '@/components/utils'
import { Fallback } from './fallback'
import { Tools } from './tools'
import { Title } from './title'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { useEditor } from '@/global/context/editor-context'
import { isEmpty } from '@/lib/utils'

const TipTap = lazy(() => import('./tip-tap'))

export function Editor() {
	const { selectedNote, handleNoteSelect } = useEditor()

	return (
		<Card className='grow size-full md:pl-4 pt-8 rounded-none overflow-hidden'>
			<Show condition={!isEmpty(selectedNote?.id)} fallback={<Fallback />}>
				<ScrollArea className='h-full w-full content-center'>
					<CardHeader className='flex items-center sticky top-0 bg-card pb-4'>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									size='sm'
									variant='destructive'
									onClick={() => handleNoteSelect(null)}
								>
									<X />
								</Button>
							</TooltipTrigger>
							<TooltipContent className='font-semibold text-sm'>
								Close current note.
							</TooltipContent>
						</Tooltip>

						<Title />
						<Tools />
					</CardHeader>

					<CardContent className='pl-9 pr-20 pt-2'>
						<TipTap />
					</CardContent>

					<ScrollBar />
				</ScrollArea>
			</Show>
		</Card>
	)
}

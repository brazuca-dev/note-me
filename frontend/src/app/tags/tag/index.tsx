import Hash from 'lucide-react/dist/esm/icons/hash'
import X from 'lucide-react/dist/esm/icons/x'
import type { Tag } from '@/data/interfaces'
import { useRef, useState } from 'react'
import { UpdateTag } from './update-tag'
import { Badge } from '@/components/ui/badge'
import { Show } from '@/components/utils'
import { useTag } from '@/hooks/use-tag'

interface TagProps {
	tag?: Tag
	selected: boolean
	onChangeSelect?: (id: string) => void
}

export function Tag({ tag, selected, onChangeSelect }: TagProps) {
	const lastClickTimestampRef = useRef<number>(0)
	const [isEditable, setIsEditable] = useState<boolean>(false)
	const { toTrashTag } = useTag()

	const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		const isDoubleClick = e.timeStamp - lastClickTimestampRef.current < 700
		lastClickTimestampRef.current = e.timeStamp

		if (tag && isDoubleClick && !isEditable) {
			setIsEditable(true)
			onChangeSelect?.(tag.id)
			return
		} // else, is single click
		onChangeSelect?.(tag?.id ?? '0')
		setIsEditable(false)
	}

	return (
		<Badge
			onClick={handleOnClick}
			className='gap-1 px-2 py-1.5'
			variant={selected ? 'secondary' : 'outline'}
		>
			<Hash className='-mr-2' />
			<Show condition={tag?.id !== undefined} fallback={<span>none</span>}>
				<UpdateTag tag={tag!} isEditable={isEditable} />
				<button aria-label='remove tag' type='button'>
					<X
						className='size-3 hover:text-destructive'
						onClick={e => {
							e.stopPropagation()
							toTrashTag(tag!.id)
						}}
					/>
				</button>
			</Show>
		</Badge>
	)
}

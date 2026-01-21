import { useTag } from '@/hooks/use-tag'
import type { Tag } from '@/data/interfaces'
import { useEffect, useRef, type ComponentRef } from 'react'

interface UpdateTagProps {
	tag: Tag
	isEditable: boolean
}

export function UpdateTag({ tag, isEditable }: UpdateTagProps) {
	const { updateTag } = useTag()
	const inputRef = useRef<ComponentRef<'input'>>(null)

	useEffect(() => {
		if (isEditable && inputRef.current) inputRef.current.focus()
	}, [isEditable])

	const inputWidth = `${(tag?.title?.length ?? 4) + (tag?.title?.length ?? 4) * 8}px`

	return (
		<input
			ref={inputRef}
			disabled={!isEditable}
			aria-label='edit tag name'
			defaultValue={tag?.title ?? 'none'}
			onBlur={e => updateTag({ id: tag!.id, title: e.target.value })}
			onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()}
			style={{ width: inputWidth }}
			className={`outline-none disabled:pointer-events-none focus:bg-none px-1 max-w-22 text-ellipsis overflow-hidden whitespace-nowrap`}
		/>
	)
}

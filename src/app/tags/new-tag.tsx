import { useTag } from '@/hooks/use-tag'

export function NewTag() {
	const { createTag } = useTag()

	const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		const valueTrimmed = e.target.value.trim()
		if (!valueTrimmed) return
		const valueWithoutSpaces = valueTrimmed.replaceAll(' ', '_')
		createTag(valueWithoutSpaces)
		e.target.value = ''
		e.currentTarget.focus()
	}

	return (
		<input
			onBlur={handleOnBlur}
			placeholder='Typing to create a new tag...'
			onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()}
			className='flex-1 bg-transparent outline-none border-b border-accent min-w-30 text-sm placeholder:text-xs'
		/>
	)
}

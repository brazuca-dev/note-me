import { removeHTMLTags } from './note-peek.utils'

interface NoteSpoilerProps {
	content: string | null
}

export const NoteSpoiler = ({ content }: NoteSpoilerProps) => {
	const cleanContent = removeHTMLTags(content)
	return <span className='line-clamp-2 my-2'>{cleanContent}</span>
}

const MAX_CONTENT_LENGTH = 100
const EMPTY_CONTENT_FALLBACK = '...'

export const removeHTMLTags = (str: string | null): string => {
	if (str === null) return EMPTY_CONTENT_FALLBACK

	const cleanedString = str.replaceAll(/<\/?[^>]+>/g, ' ').trim()
	return cleanedString.slice(0, MAX_CONTENT_LENGTH)
}

export const isNoteRecent = (
	createdAt: Date,
	recentTimeDiff: number
): boolean => {
	return Date.now() - createdAt.getTime() < recentTimeDiff
}

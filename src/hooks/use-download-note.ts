import { useEffect, useState } from 'react'
import type { Note } from '@/data/interfaces'

export function useDownloadNote(note: Note) {
	const [hasDownloaded, setHasDownloaded] = useState<boolean | null>(null)

	useEffect(() => {
		// reset 'hasDownloaded' state
		if (hasDownloaded !== null) {
			const timer = setTimeout(
				() => setHasDownloaded(null),
				import.meta.env.VITE_TRANSITION_DURATION
			)
			return () => clearTimeout(timer)
		}
	}, [hasDownloaded])

	const toMarkdown = () => {
		return `# **${note.title}**`
			.concat(`\n\n${note.content}\n\n`)
			.concat(
				`> 🌱 Note created with _note.me_ at: ${note.createdAt.toLocaleString()}  \n`
			)
			.concat(
				`> 🌠 Please, give a star on project acessing https://github.com/BrazucaDeveloper/note-me`
			)
	}

	const downloadNote = () => {
		if (!note) return null
		const markdown = toMarkdown()

		try {
			const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = `${note.title.replaceAll(' ', '_')}.note_me.md`
			a.click()
			URL.revokeObjectURL(url)
		} catch (error) {
			setHasDownloaded(false)
		}
		setHasDownloaded(true)
	}

	return { downloadNote, hasDownloaded }
}

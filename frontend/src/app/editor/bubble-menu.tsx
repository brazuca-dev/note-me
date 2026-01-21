import { Editor, useEditorState } from '@tiptap/react'
import { BubbleMenu as BubbleMenuTipTap } from '@tiptap/react/menus'
import Bold from 'lucide-react/dist/esm/icons/bold'
import Italic from 'lucide-react/dist/esm/icons/italic'
import Underline from 'lucide-react/dist/esm/icons/underline'
import Strikethrough from 'lucide-react/dist/esm/icons/strikethrough'
import { Button } from '@/components/ui/button'

export function BubbleMenu({ editor }: { editor: Editor }) {
	const editorState = useEditorState({
		editor,
		selector: ctx => {
			return {
				isBold: ctx.editor.isActive('bold') ?? false,
				canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
				isItalic: ctx.editor.isActive('italic') ?? false,
				canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
				isStrike: ctx.editor.isActive('strike') ?? false,
				canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
				isUnderline: ctx.editor.isActive('underline') ?? false,
				canUnderline: ctx.editor.can().chain().toggleUnderline().run() ?? false,
			}
		},
	})

	return (
		<BubbleMenuTipTap
			editor={editor}
			className='bg-border rounded-sm p-0.5 *:rounded-none *:first:rounded-l-md *:last:rounded-r-md'
		>
			<Button
				variant='secondary'
				aria-label='Toggle bold'
				disabled={!editorState.canBold}
				data-active={editorState.isBold}
				onClick={() => editor.chain().focus().toggleBold().run()}
				className='data-[active=true]:text-foreground text-foreground/50'
			>
				<Bold className='h-4 w-4' />
			</Button>
			<Button
				variant='secondary'
				aria-label='Toggle italic'
				disabled={!editorState.canItalic}
				data-active={editorState.isItalic}
				onClick={() => editor.chain().focus().toggleItalic().run()}
				className='data-[active=true]:text-foreground text-foreground/50'
			>
				<Italic className='h-4 w-4' />
			</Button>
			<Button
				variant='secondary'
				aria-label='Toggle strike'
				disabled={!editorState.canStrike}
				data-active={editorState.isStrike}
				onClick={() => editor.chain().focus().toggleStrike().run()}
				className='data-[active=true]:text-foreground text-foreground/50'
			>
				<Strikethrough className='h-4 w-4' />
			</Button>
			<Button
				variant='secondary'
				aria-label='Toggle underline'
				disabled={!editorState.canStrike}
				data-active={editorState.isUnderline}
				onClick={() => editor.chain().focus().toggleUnderline().run()}
				className='data-[active=true]:text-foreground text-foreground/50'
			>
				<Underline className='h-4 w-4' />
			</Button>
		</BubbleMenuTipTap>
	)
}

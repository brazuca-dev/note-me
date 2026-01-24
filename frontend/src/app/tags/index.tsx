import { Tag } from './tag'
import { NewTag } from './new-tag'
import { useLiveQueryTag } from '@/hooks/use-live-query/tag'
import { For } from '@/components/utils'
import { useEditor } from '@/global/context/editor-context'
import TagsIcon from 'lucide-react/dist/esm/icons/tags'

export function MyTags() {
	const { tags } = useLiveQueryTag()
	const { handleTagsSelected, selectedTags } = useEditor()

	return (
		<>
			<h5>
				<TagsIcon className='size-4.5 stroke-[1.5px] inline mr-1.5' /> Your tags
			</h5>

			<div className='flex flex-wrap gap-2 pl-1 pt-2'>
				<Tag
					selected={selectedTags.has('0')}
					onChangeSelect={handleTagsSelected}
				/>

				<For each={tags}>
					{tag => (
						<Tag
							tag={tag}
							key={tag.id}
							onChangeSelect={handleTagsSelected}
							selected={selectedTags.has(tag.id)}
						/>
					)}
				</For>

				<NewTag />
			</div>
		</>
	)
}

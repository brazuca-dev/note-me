import Sprout from 'lucide-react/dist/esm/icons/sprout'
import type { ComponentProps } from 'react'
import { Show } from './utils'

interface LogoProps extends ComponentProps<'svg'> {
	withTitle?: boolean
	orientation?: 'row' | 'column'
}

export function Logo({ withTitle = true, orientation = 'row' }: LogoProps) {
	return (
		<Show
			condition={withTitle}
			fallback={
				<Sprout className='box-content bg-foreground p-1 rounded-sm text-background stroke-[1.5px]' />
			}
		>
			<div className={`flex flex-${orientation} items-end gap-0.5`}>
				<Sprout className='box-content p-1' />
				<h4>Note.me</h4>
			</div>
		</Show>
	)
}

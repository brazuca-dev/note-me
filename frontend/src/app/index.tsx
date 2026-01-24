import { Providers } from '@/global'
import { ErrorBoundary } from 'react-error-boundary'
import { Logo } from '@/components/logo'
import { Noteme } from './note-me'

export default function App() {
	return (
		<ErrorBoundary
			fallback={
				<div
					role='alert'
					className='h-dvh w-full flex flex-col justify-center items-center'
				>
					<div className='flex items-end gap-2 mb-0.5'>
						<Logo className='inline' />
						<small>(Client error)</small>
					</div>
					<span className='text-xl'>Something went wrong :/</span>
					<p>We apologize for the inconvenience. Try again later.</p>
				</div>
			}
		>
			<Providers>
				<Noteme />
			</Providers>
		</ErrorBoundary>
	)
}

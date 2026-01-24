import { useEffect } from 'react'
import { Editor } from './editor'
import { useAuth } from '@clerk/clerk-react'
import { useSyncData } from '@/hooks/use-sync-data'
import { Aside } from './aside'
import { Toaster } from '@/components/ui/sonner'

export function Noteme() {
	const sync = useSyncData()
	const { isLoaded, isSignedIn } = useAuth()

	useEffect(() => {
		if (isLoaded && isSignedIn) sync()
	}, [isLoaded, isSignedIn])

	return (
		<div className='flex h-dvh max-h-screen w-dvw subpixel-antialiased'>
			<Aside />
			<Editor />
			<Toaster position='bottom-right' closeButton />
		</div>
	)
}

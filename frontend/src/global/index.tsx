import { Compose } from '@/components/utils'
import { ClerkProvider } from '@clerk/clerk-react'
import type { ReactElement } from 'react'
import { SearchProvider } from './context/search-context'
import { EditorProvider } from './context/editor-context'
import { SaveProvider } from './context/save-context'
import { SidebarProvider } from '@/components/ui/sidebar'

interface ProvidersProps {
	children: ReactElement
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

export function Providers({ children }: ProvidersProps) {
	return (
		<ClerkProvider
			publishableKey={PUBLISHABLE_KEY}
			appearance={{ cssLayerName: 'clerk' }}
		>
			<Compose
				providers={[
					SidebarProvider,
					SearchProvider,
					EditorProvider,
					SaveProvider,
				]}
			>
				{children}
			</Compose>
		</ClerkProvider>
	)
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Providers } from './global'

import './index.css'
import App from './app'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Providers>
			<App />
		</Providers>
	</StrictMode>
)

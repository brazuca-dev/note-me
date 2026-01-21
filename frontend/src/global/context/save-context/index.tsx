import {
	createContext,
	useContext,
	useReducer,
	useEffect,
	useTransition,
	type ReactElement,
	useMemo,
	useCallback,
} from 'react'
import { saveReducer, type SaveReducerState, saveActions } from './save-reducer'

const transitionDuration =
	Number(import.meta.env.VITE_TRANSITION_DURATION) || 3_000

interface SaveContextProps {
	isSaving: boolean
	startSaving: React.TransitionStartFunction
	isSaved: SaveReducerState
	handleIsSaved: (isSaved: boolean, type: 'local' | 'remote' | 'both') => void
}

const SaveContext = createContext<SaveContextProps | null>(null)

export const SaveProvider = ({ children }: { children: ReactElement }) => {
	const [isSaving, startSaving] = useTransition()
	const [isSaved, dispatchIsSaved] = useReducer(saveReducer, {
		localSaved: null,
		remoteSaved: null,
	})

	const handleIsSaved = useCallback(
		(isSaved: boolean, type: 'local' | 'remote' | 'both') => {
			dispatchIsSaved(saveActions[type](isSaved))
		},
		[]
	)

	useEffect(() => {
		const id = setTimeout(
			() => dispatchIsSaved(saveActions.reset()),
			transitionDuration
		)
		return () => clearTimeout(id)
	}, [isSaved.localSaved, isSaved.remoteSaved])

	const value = useMemo(
		() => ({
			isSaving,
			startSaving,
			isSaved,
			handleIsSaved,
		}),
		[isSaving, isSaved, handleIsSaved]
	)

	return <SaveContext value={value}>{children}</SaveContext>
}

export const useSave = () => {
	const context = useContext(SaveContext)
	if (!context) throw new Error('useSave deve ser usado dentro de SaveProvider')
	return context
}

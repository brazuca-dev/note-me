import {
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
} from '@clerk/clerk-react'
import User from 'lucide-react/dist/esm/icons/user'
import { Button } from '@/components/ui/button'

export function UserAccount() {
	return (
		<>
			<SignedOut>
				<SignInButton mode='modal'>
					<Button variant='secondary' size='icon'>
						<User />
					</Button>
				</SignInButton>
			</SignedOut>

			<SignedIn>
				<UserButton
					appearance={{
						elements: {
							userButtonBox: 'p-0.5 rounded-full border border-primary',
						},
					}}
				/>
			</SignedIn>
		</>
	)
}

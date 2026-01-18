import { z } from 'zod'

const envSchema = z.object({
	CLERK_PUBLISHABLE_KEY: z.string().min(1),
	CLERK_SECRET_KEY: z.string().min(1),
	CLERK_JWT_KEY: z.string().min(1),

	TURSO_DATABASE_URL: z.url(),
	TURSO_AUTH_TOKEN: z.string().min(1),

	FRONT_END_URL: z.url(),

	PORT: z.coerce.number().default(3000),
})

const parsed = envSchema.safeParse(Bun.env)

if (!parsed.success) {
	console.error(
		'❌ Invalid environment variables:',
		z.treeifyError(parsed.error)
	)
	throw new Error('Invalid configuration.')
}

export const env = parsed.data

declare module "bun" {
  interface Env {
    CLERK_PUBLISHABLE_KEY: string
    CLERK_SECRET_KEY: string
    CLERK_JWT_KEY: string
    
    TURSO_DATABASE_URL: string
    TURSO_AUTH_TOKEN: string
    
    FRONT_END_URL: string
  }
}
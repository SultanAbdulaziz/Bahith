// Mirrors the backend's rules: at least 8 characters, at most 72 bytes (bcrypt's limit).
// Returns the translation key of the problem, or null if the password is fine.
export function validatePassword(password: string) {
  if (password.length < 8) return "auth.errors.passwordShort" as const
  if (new TextEncoder().encode(password).length > 72) return "auth.errors.passwordLong" as const
  return null
}

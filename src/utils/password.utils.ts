// utils/password.utils.ts
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

// Hash the plain password
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS)
}

// Compare a plain password with a stored hash
export const comparePassword = async (password: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(password, hashed)
}

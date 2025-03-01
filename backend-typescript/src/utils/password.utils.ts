/**
 * Compares a plain text password with a hashed password
 * @param plainPassword The plain text password to compare
 * @param hashedPassword The hashed password to compare against
 * @returns Promise<boolean> True if passwords match, false otherwise
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    // Use bcrypt to compare the passwords
    const bcrypt = require('bcrypt');
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

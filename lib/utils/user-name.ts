/**
 * Generates a display name from an email address when no name is available.
 * Format: "Initial. Surname" (e.g., "jmanio@example.com" → "J. Manio")
 * 
 * @param email - The user's email address
 * @returns A formatted display name derived from the email
 */
export function getDisplayNameFromEmail(email: string): string {
  const localPart = email.split('@')[0];
  
  if (!localPart || localPart.length === 0) {
    return 'No name';
  }
  
  if (localPart.length === 1) {
    return localPart.charAt(0).toUpperCase();
  }
  
  const initial = localPart.charAt(0).toUpperCase();
  const surname = localPart.slice(1);
  
  // Capitalize the first letter of the surname
  const capitalizedSurname = surname.charAt(0).toUpperCase() + surname.slice(1);
  
  return `${initial}. ${capitalizedSurname}`;
}


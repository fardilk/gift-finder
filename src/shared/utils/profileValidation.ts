import type { User } from 'src/auth/api';

// A minimal heuristic for profile completeness.
// Consider complete if a displayable name exists (or potentially other fields in future).
export function isProfileComplete(user: Pick<User, 'id' | 'email' | 'name'> | null | undefined): boolean {
  if (!user) return false;
  // If backend extends profile fields in User later, expand checks here.
  return !!(user.name && user.name.trim().length > 0);
}

export function getProfileCompletionMessage(): string {
  return 'Your profile looks incomplete. Please add your name and details to continue.';
}

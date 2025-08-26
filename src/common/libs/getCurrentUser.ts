import { auth } from '../../lib/firebase';

export function getCurrentUser() {
  try {
    return auth.currentUser;
  } catch {
    return null;
  }
}

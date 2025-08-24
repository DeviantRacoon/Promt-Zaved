import { getAuth } from 'firebase/auth';

export function getCurrentUser() {
  try {
    return getAuth().currentUser;
  } catch {
    return null;
  }
}

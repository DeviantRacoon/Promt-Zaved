import { useEffect, useState } from 'preact/hooks';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../config/firebase';

/**
 * Subscribe to Firebase auth state and expose the current user.
 * `user` will be `undefined` while Firebase initializes.
 */
export function useAuthState() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return {
    user,
    loading: user === undefined,
  };
}

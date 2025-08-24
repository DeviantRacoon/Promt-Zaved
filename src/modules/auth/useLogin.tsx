import { signInWithEmailAndPassword, signOut, GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';

import { auth } from '../../config/firebase';

import { type LoginForm } from '../../common/interfaces/auth';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useAuth() {
  const authContext = getAuth();
  const provider = new GoogleAuthProvider();

  const [loginForm, setLoginForm] = useState<LoginForm>({ email: '', password: '' });
  const [loginStep, setLoginStep] = useState<0 | 1>(0);
  const [loading, setLoading] = useState<'idle' | 'loading' | 'error'>('idle');

  const onLoginChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setLoginForm((prev) => ({ ...prev, [target.name]: target.value }));
  };

  const submitLogin = async () => {
    setLoading('loading');

    if (!emailRegex.test(loginForm.email) || loginForm.password.length === 0) {
      setLoading('error');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
      route('/dashboard');

    } catch (err: any) {
      setLoading('error');
      console.error(err);
    }
  };

  async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(authContext, provider);

      const user = result.user;
      console.log("¡Usuario ha iniciado sesión con Google!", user.displayName || user.email);

      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential) {
        const accessToken = credential.accessToken;
        console.log("Token de acceso de Google:", accessToken);
      }

      route('/dashboard');
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error al iniciar sesión con Google:", errorCode, errorMessage);

      // const email = error.customData?.email;
      // const credential = GoogleAuthProvider.credentialFromError(error);
    }
  }

  const logout = () => {
    signOut(auth);
  };

  return {
    logout,
    loading,
    signInWithGoogle,
    form: loginForm,
    step: loginStep,
    setStep: setLoginStep,
    change: onLoginChange,
    submit: submitLogin,
  };
}

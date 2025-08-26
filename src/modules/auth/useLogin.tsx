import { signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';

import { auth } from '../../lib/firebase/auth';
import { firefoxGoogleOIDC } from '../../lib/ffx-identity';

import { type LoginForm } from '../../common/interfaces/auth';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useAuth() {
  const authContext = auth;

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
      const { idToken } = await firefoxGoogleOIDC();
      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(authContext, credential);
      route('/dashboard');
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error al iniciar sesión con Google:", errorCode, errorMessage);
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

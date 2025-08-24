import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'preact/hooks';

import { auth } from '../../../config/firebase';

import { type ForgotForm } from '../../../common/interfaces/auth';

export function useForgotPassword() {
  const [forgotForm, setForgotForm] = useState<ForgotForm>({ email: '' });
  const [loading, setLoading] = useState<'idle' | 'loading' | 'error'>('idle');

  const submitForgot = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotForm.email)) return;

    try {
      setLoading('loading');

      await sendPasswordResetEmail(auth, forgotForm.email);
      setLoading('idle');

    } catch (err: any) {
      setLoading('error');
    }
  };

  return {
    form: forgotForm,
    change: (e: Event) => {
      const target = e.target as HTMLInputElement;
      setForgotForm((prev) => ({ ...prev, [target.name]: target.value }));
    },
    submit: submitForgot,
    loading,
  };
}


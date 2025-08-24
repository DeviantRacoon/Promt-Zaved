import { createUserWithEmailAndPassword, updateProfile, getAuth } from 'firebase/auth';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';

import { auth } from '../../../config/firebase';

import { type RegisterForm } from '../../../common/interfaces/auth';

export function useRegister() {
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    email: '',
    password: '',
    confirm: '',
    accept: false,
  });

  const [registerTouched, setRegisterTouched] = useState<Record<keyof RegisterForm, boolean>>({
    email: false,
    password: false,
    confirm: false,
    accept: false,
  });

  const [loading, setLoading] = useState<'idle' | 'loading' | 'error'>('idle');

  const registerValid = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email),
    password: registerForm.password.length >= 8,
    confirm: registerForm.confirm === registerForm.password && registerForm.confirm.length > 0,
    accept: registerForm.accept === true,
  };

  const registerFormValid =
    registerValid.email &&
    registerValid.password &&
    registerValid.confirm &&
    registerValid.accept;

  const onRegisterChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const { name, type } = target;
    const value = type === 'checkbox' ? target.checked : target.value;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  const onRegisterBlur = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setRegisterTouched((prev) => ({ ...prev, [target.name]: true }));
  };

  const submitRegister = async () => {
    setRegisterTouched({
      email: true,
      password: true,
      confirm: true,
      accept: true,
    });

    if (!registerFormValid) return;

    try {
      setLoading('loading');

      await createUserWithEmailAndPassword(auth, registerForm.email, registerForm.password);
      route('/config-user');
      setLoading('idle');

    } catch (err: any) {
      setLoading('error');
      console.error(err);
    }
  };

  const updateUser = async (displayName: string) => {
    try {
      await updateProfile(getAuth().currentUser!, { displayName });
    } catch (error) {
      console.error(error);
    }
  };

  return {
    form: registerForm,
    touched: registerTouched,
    change: onRegisterChange,
    blur: onRegisterBlur,
    submit: submitRegister,
    valid: registerValid,
    formValid: registerFormValid,
    updateUser,
    loading,
  };
}


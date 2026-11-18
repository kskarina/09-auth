'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { register } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './SignUpPage.module.css';

interface ApiErrorData {
  error?: string;
  response?: {
    message?: string;
    validation?: { body?: { message?: string } };
  };
}

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setError('');
    setIsPending(true);
    try {
      const user = await register({
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
      });
      setUser(user);
      router.push('/profile');
    } catch (err) {
      if (isAxiosError<ApiErrorData>(err)) {
        setError(
          err.response?.data?.response?.validation?.body?.message ??
            err.response?.data?.response?.message ??
            err.response?.data?.error ??
            err.message
        );
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} action={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isPending}
          >
            Register
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}

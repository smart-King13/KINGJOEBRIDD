'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; errors?: Record<string, string[]> } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await register({ name, email, password, password_confirmation: passwordConfirmation });
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#050505] p-4 sm:p-8">
      <div className="flex w-full max-w-[1100px] min-h-[700px] bg-[var(--color-white)] rounded-[2.5rem] overflow-hidden shadow-2xl">
        {/* Left Side - Image */}
        <div className="hidden lg:block relative w-1/2">
          <Image
            src="/images/hero-img2.jpg"
            alt="KINGJOEBRIDD Fashion Craftsmanship"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[var(--color-black)]/30" />
          <div className="absolute bottom-12 left-12 text-[var(--color-white)] max-w-md">
            <h2 className="font-display text-4xl leading-tight mb-4 tracking-wide">Join the vanguard of African tailoring.</h2>
            <p className="font-sans text-sm tracking-wider uppercase opacity-80">Craftsmanship tailored to you.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-20">
          <div className="w-full max-w-md mx-auto space-y-10">
            
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="font-display text-2xl font-bold tracking-widest text-[var(--color-black)] hover:opacity-70 transition-opacity">
                KINGJOEBRIDD
              </Link>
            </div>

            <div>
              <h1 className="font-display text-4xl font-bold text-[var(--color-black)] mb-2">
                Create Account
              </h1>
              <p className="text-sm text-[var(--color-ash)]">
                Enter your details to join KINGJOEBRIDD.
              </p>
            </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <Alert variant="error" title="Registration Failed">
                {error.message}
              </Alert>
            )}
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide text-[var(--color-black)]">Full Name</label>
                <Input
                  variant="rounded"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  error={!!error?.errors?.name}
                  placeholder="Enter your full name"
                />
                {error?.errors?.name && (
                  <p className="text-xs text-[var(--color-error)] mt-1 font-medium">{error.errors.name[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide text-[var(--color-black)]">Email Address</label>
                <Input
                  type="email"
                  variant="rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  error={!!error?.errors?.email}
                  placeholder="Enter your email"
                />
                {error?.errors?.email && (
                  <p className="text-xs text-[var(--color-error)] mt-1 font-medium">{error.errors.email[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide text-[var(--color-black)]">Password</label>
                <Input
                  type="password"
                  variant="rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  error={!!error?.errors?.password}
                  placeholder="Create a password"
                />
                {error?.errors?.password && (
                  <p className="text-xs text-[var(--color-error)] mt-1 font-medium">{error.errors.password[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide text-[var(--color-black)]">Confirm Password</label>
                <Input
                  type="password"
                  variant="rounded"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-sm tracking-[0.1em] rounded-full mt-8" isLoading={isLoading}>
              CREATE ACCOUNT
            </Button>

            <div className="mt-8 pt-6 border-t border-[var(--color-light-ash)] text-center">
              <p className="text-sm text-[var(--color-ash)]">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-[var(--color-black)] hover:underline underline-offset-4 decoration-[var(--color-ash)] transition-all">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}

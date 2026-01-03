/**
 * AUTH PAGE
 * Cinematic login experience
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { useStore } from '@/lib/store';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AnimatedBackground from '@/components/animations/AnimatedBackground';
import { Plane } from 'lucide-react';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useStore();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Cinematic entrance animation
    gsap.fromTo(
      card,
      {
        opacity: 0,
        y: 50,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
      }
    );
  }, []);

  const handleLogin = () => {
    login(email, password);
    router.push('/dashboard');
  };

  const handleDemoLogin = () => {
    login('demo@globaltrotter.com', 'demo');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Auth Card */}
      <div
        ref={cardRef}
        className="glass-card p-8 md:p-12 max-w-md w-full relative"
        style={{ zIndex: 10 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Plane className="w-12 h-12 text-[var(--accent-primary)]" />
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="neon-text">Global</span>
            <span className="text-white"> Trotter</span>
          </h1>
        </div>

        <h2
          className="text-2xl font-semibold mb-2 text-center"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Welcome Back
        </h2>
        <p className="text-[var(--text-secondary)] mb-8 text-center">
          Sign in to continue your journey
        </p>

        {/* Login Form */}
        <div className="space-y-4">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button
            variant="primary"
            className="w-full"
            onClick={handleLogin}
          >
            Sign In
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--glass-border)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[var(--bg-surface)] text-[var(--text-secondary)]">
                Or
              </span>
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleDemoLogin}
          >
            Try Demo Login
          </Button>
        </div>

        {/* Sign Up Link */}
        <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
          Don't have an account?{' '}
          <button className="text-[var(--accent-primary)] hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

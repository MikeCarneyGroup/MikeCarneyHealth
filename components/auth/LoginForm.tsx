'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Mail } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const allowedDomains = [
    'lexusoftownsville.com.au',
    'mikecarneytoyota.com.au',
    'inghamtoyota.com.au',
    'charterstowerstoyota.com.au',
    'mikecarneymahindra.com.au',
    '4wdc.com.au',
    'gmail.com', // Temporary for testing
  ];

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate email domain
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain || !allowedDomains.includes(domain)) {
      alert('Please use an authorized company email address.');
      setIsLoading(false);
      return;
    }

    await signIn('email', { email, callbackUrl: '/dashboard' });
    setEmailSent(true);
    setIsLoading(false);
  };

  const handleAzureLogin = async () => {
    setIsLoading(true);
    await signIn('azure-ad', { callbackUrl: '/dashboard' });
  };

  if (emailSent) {
    return (
      <div className="card text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
          <Mail className="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold mb-2">Check your email</h2>
        <p className="text-gray-600">
          A sign-in link has been sent to <strong>{email}</strong>
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Click the link in the email to complete sign-in.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-800 text-sm" role="alert">
          {error === 'AccessDenied' && 'Access denied. Please use an authorized company email.'}
          {error === 'Configuration' && 'There is a problem with the server configuration.'}
          {error === 'Verification' && 'The sign-in link is invalid or has expired.'}
          {!['AccessDenied', 'Configuration', 'Verification'].includes(error) && 'An error occurred. Please try again.'}
        </div>
      )}

      <div className="space-y-4">
        {/* Azure AD login temporarily disabled - uncomment when credentials available */}
        {/* <button
          type="button"
          onClick={handleAzureLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 btn-primary py-3"
        >
          <svg className="h-5 w-5" viewBox="0 0 23 23" fill="currentColor" aria-hidden="true">
            <path d="M0 0h10.931v10.931H0zm12.069 0H23v10.931H12.069zM0 12.069h10.931V23H0zm12.069 0H23V23H12.069z"/>
          </svg>
          Sign in with Microsoft 365
        </button> */}

        {/* Divider - show only when both login methods available */}
        {/* <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div> */}

        <form onSubmit={handleEmailLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="label">
              Company Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.name@company.com.au"
              className="input"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Use your authorized company email address
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-outline py-3"
          >
            {isLoading ? 'Sending...' : 'Send Sign-In Link'}
          </button>
        </form>

        <div className="text-xs text-gray-500 text-center mt-4">
          <p>Authorized domains:</p>
          <ul className="mt-1 space-y-0.5">
            {allowedDomains.map((domain) => (
              <li key={domain}>@{domain}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

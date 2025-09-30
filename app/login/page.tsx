import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-gray-600">
            Sign in to access the staff wellbeing hub
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

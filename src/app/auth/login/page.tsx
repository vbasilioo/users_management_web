import { ManagementIllustration } from '@/components';
import { LoginForm } from '@/components/auth/login-form/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 items-center justify-center px-8 sm:px-12 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-3xl font-bold">Welcome back! <span className="inline-block">👋</span></h1>
            <p className="mt-3 text-gray-600">
              Access your management dashboard securely.<br />
              Sign in to control user permissions and settings.
            </p>
          </div>
          
          <LoginForm />
          
        </div>
      </div>
      
      <div className="hidden lg:block lg:w-1/2">
        <div className="h-screen w-full">
          <ManagementIllustration />
        </div>
      </div>
    </div>
  );
} 
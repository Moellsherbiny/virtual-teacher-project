import LoginForm from '@/components/LoginForm';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left side illustration */}
      <div className="w-full md:flex hidden md:w-1/2 items-center justify-center bg-secondary p-8">
        <Image
          src="/images/login-image.png" 
          alt="Login illustration"
          width={400}
          height={400}
          className="max-w-full h-auto"
        />
      </div>

      {/* Right side form */}
      <div className="flex w-full md:w-1/2 flex-col items-center justify-center p-8">
        <div className="absolute top-4 right-4">
        
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

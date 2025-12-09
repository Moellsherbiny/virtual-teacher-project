import SignupForm from '@/components/SignUpForm'
import Image from 'next/image';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left illustration */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-secondary p-8">
        <Image
          src="/images/signup-image.png" 
          alt="Signup illustration"
          width={400}
          height={400}
          className="max-w-full h-auto"
        />
      </div>

      {/* Right form */}
      <div className="relative flex w-full md:w-1/2 flex-col items-center justify-center p-8">
        <div className="absolute top-4 right-4">
          
        </div>
        <SignupForm />
      </div>
    </div>
  );
}

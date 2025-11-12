
import { createFileRoute } from '@tanstack/react-router';
import { SignupForm } from '@/components/signup-form';

export const Route = createFileRoute('/signup')({
  component: Signup,
});

function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignupForm />
    </div>
  );
}

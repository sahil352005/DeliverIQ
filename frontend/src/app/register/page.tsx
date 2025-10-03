import AuthForm from '../../components/AuthForm';

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto mt-12">
      <AuthForm mode="register" />
      <div className="mt-4 text-center">
        <a href="/login" className="text-blue-600 hover:underline">Login</a>
      </div>
    </div>
  );
}
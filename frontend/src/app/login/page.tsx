import AuthForm from '../../components/AuthForm';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-12">
      <AuthForm mode="login" />
      <div className="mt-4 text-center">
        <a href="/register" className="text-blue-600 hover:underline">Register</a>
      </div>
    </div>
  );
}
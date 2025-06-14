import { FcGoogle } from "react-icons/fc";

export const Login = () => {
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-100">
      <div className="w-96 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to NuMarket</h1>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm hover:scale-105">
          <FcGoogle />
          <span className="text-gray-300 font-medium">Continue with Google</span>
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};
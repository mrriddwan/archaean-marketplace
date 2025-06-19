import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../hooks/useAuth";
import { usePageTitle } from "../../hooks/usePageTitle";

export const Login = () => {
  const { loginWithGoogle, setIsAuthenticating, isAuthenticating } = useAuth();
  usePageTitle("Login | ArcMarketplace");
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-100">
      <div className="w-96 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to NuMarket
          </h1>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        <button
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm hover:scale-105"
          disabled={isAuthenticating}
          onClick={() => {
            loginWithGoogle();
            setIsAuthenticating(true);
          }}
        >
          {isAuthenticating ? (
            <div>Loading ...</div>
          ) : (
            <div className="flex gap-3 items-center justify-center">
              <FcGoogle />
              <span className="text-gray-300 font-medium">
                Continue with Google
              </span>
            </div>
          )}
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

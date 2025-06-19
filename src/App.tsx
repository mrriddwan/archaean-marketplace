import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";
import { UserContextProvider, useUserContext } from "./contexts/userContext";
import { ProductMain } from "./components/product/ProductMain";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Login } from "./components/auth/Login";

const AuthententicatedSession = () => {
  const { userContext } = useUserContext();

  return userContext.isAuthenticated ? <ProductMain /> : <Login />;
};

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const queryClient = new QueryClient();
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <AuthententicatedSession />
        </UserContextProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

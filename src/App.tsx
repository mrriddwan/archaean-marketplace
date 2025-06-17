import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";
// import { Login } from "./components/auth/Login";
import { UserContextProvider } from "./contexts/userContext";
import { ProductMain } from "./components/product/ProductMain";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const queryClient = new QueryClient();
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          {/* <Login /> */}
          <ProductMain />
        </UserContextProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

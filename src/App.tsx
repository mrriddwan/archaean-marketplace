import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";
import { UserContextProvider } from "./contexts/userContext";
import { ProductMain } from "./components/product/ProductMain";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Login } from "./components/auth/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthRoute } from "./routes/AuthRoute";

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const queryClient = new QueryClient();
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/products" element={<AuthRoute><ProductMain /></AuthRoute>} />
              <Route path="*" element={<Navigate to="/products" replace />} />
            </Routes>
          </BrowserRouter>
        </UserContextProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

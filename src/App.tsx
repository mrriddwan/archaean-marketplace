import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";
import { Login } from "./components/auth/Login";
import { UserContextProvider } from "./contexts/userContext";

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <UserContextProvider>
        <Login />
      </UserContextProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

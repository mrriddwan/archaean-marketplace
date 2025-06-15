import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useUserContext } from "../contexts/userContext";
import { authService } from "../services/authService";

interface ICookie {
  accessToken: string | null;
  expiresIn: number | null;
  refreshToken: string | null;
}
export function useAuthHook() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authCookie, setAuthCookie] = useState<ICookie>({
    accessToken: "",
    expiresIn: null,
    refreshToken: "",
  });
  const { setUserContext } = useUserContext();

  const fetchUserInfo = async (access_token: string) => {
    const userInfo = await authService.fetchUserInfo(access_token);

    if (userInfo.data) {
      console.log({ userInfo });
      console.log("User Info:", userInfo.data);

      setUserContext({
        id: userInfo.data.sub,
        email: userInfo.data.email,
        name: userInfo.data.name,
        picture: userInfo.data.picture,
        given_name: userInfo.data.given_name,
        family_name: userInfo.data.family_name,
        email_verified: userInfo.data.email_verified,
        isAuthenticated: true,
      });
    }

    setIsAuthenticating(false);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log({ tokenResponse });
      setAuthCookie({
        ...authCookie,
        accessToken: tokenResponse.access_token,
        expiresIn: tokenResponse.expires_in,
      });
      fetchUserInfo(tokenResponse.access_token);
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  return {
    //states
    isAuthenticating,
    authCookie,
    //setter
    setIsAuthenticating,
    setAuthCookie,

    //methods
    fetchUserInfo,
    googleLogin,
  };
}

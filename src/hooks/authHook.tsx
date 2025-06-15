import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { initialUserContext, useUserContext } from "../contexts/userContext";
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
    const userInfo = await authService.getUserGoogleInfo(access_token);

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

  const loginWithGoogle = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (codeResponse) => {
      console.log({ codeResponse });

      (async () => {
        try {
          //1. get refresh token, accessToken, expires
          const tokenResponse = await authService.getRefreshToken(
            codeResponse.code
          );

          if (tokenResponse?.data) {
            const responseData = tokenResponse.data;

            // 2. set Cookie with required auth details
            setAuthCookie({
              refreshToken: responseData.refresh_token,
              accessToken: responseData.access_token,
              expiresIn: responseData.expires_in,
            });
            // 3. get user info with access token
            fetchUserInfo(responseData.access_token);

            // 4. get new Access token before expires
            setTimeout(() => {
              // gets a new token for you after 10 seconds (test purpose)
              authService.getNewAccessToken(responseData.refresh_token);
            }, 10000);
          }
        } catch (error) {
          console.log(error);
        }
      })();
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  const logout = () => {
    googleLogout();
    setUserContext(initialUserContext);
  };

  return {
    //states
    isAuthenticating,
    authCookie,
    //setter
    setIsAuthenticating,
    setAuthCookie,

    //methods
    fetchUserInfo,
    loginWithGoogle,
    logout,
  };
}

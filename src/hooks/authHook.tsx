import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { initialUserContext, useUserContext } from "../contexts/userContext";
import { authService } from "../services/auth.service";
import Cookies from "js-cookie";

// interface ICookie {
//   accessToken: string | null;
//   expiresIn: number | null;
//   refreshToken: string | null;
// }
export function useAuthHook() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { setUserContext } = useUserContext();

  const fetchUserInfo = async (access_token: string) => {
    const userInfo = await authService.getUserGoogleInfo(access_token);

    if (userInfo.data) {
      // console.log({ userInfo });
      // console.log("User Info:", userInfo.data);

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
            const expiresInSeconds = responseData.expires_in;

            Cookies.set("accessToken", responseData.access_token, {
              expires: expiresInSeconds / 86400,
            });
            Cookies.set("refreshToken", responseData.refresh_token, {
              expires: 7,
            });

            // 3. get user info with access token + get new access token before expires
            const refreshTime = expiresInSeconds * 0.9 * 1000; // ms

            function getNewRefreshToken() {
              setTimeout(async () => {
                try {
                  const newTokenRes: any = await authService.getNewAccessToken(
                    responseData.refresh_token
                  );

                  if (newTokenRes?.data?.access_token) {
                    const newAccessToken = newTokenRes.data.access_token;
                    const newExpiresIn = newTokenRes.data.expires_in;

                    Cookies.set("accessToken", newAccessToken, {
                      expires: newExpiresIn / 86400,
                    });

                    fetchUserInfo(newAccessToken);

                    getNewRefreshToken();
                  }
                } catch (e) {
                  console.error("Failed to refresh access token:", e);
                }
              }, refreshTime);
            }
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
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setUserContext(initialUserContext);
  };

  return {
    //states
    isAuthenticating,
    setIsAuthenticating,

    //methods
    fetchUserInfo,
    loginWithGoogle,
    logout,
  };
}

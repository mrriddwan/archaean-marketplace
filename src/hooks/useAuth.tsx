import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { initialUserContext, useUserContext } from "../contexts/userContext";
import { authService } from "../services/auth.service";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

// interface ICookie {
//   accessToken: string | null;
//   expiresIn: number | null;
//   refreshToken: string | null;
// }

export function useAuth() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { setUserContext } = useUserContext();
  const navigate = useNavigate();
  const { login } = useUserContext();
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

  function getNewRefreshToken(refreshToken: string, refreshTime: number) {
    setTimeout(async () => {
      try {
        const newTokenRes: any = await authService.getNewAccessToken(
          refreshToken
        );

        if (newTokenRes?.data?.access_token) {
          const newAccessToken = newTokenRes.data.access_token;
          const newExpiresIn = newTokenRes.data.expires_in;

          Cookies.set("accessToken", newAccessToken, {
            expires: newExpiresIn / 86400,
          });

          fetchUserInfo(newAccessToken);

          getNewRefreshToken(newTokenRes?.data?.refresh_token, refreshTime);
        }
      } catch (e) {
        console.error("Failed to refresh access token:", e);
      }
    }, refreshTime);
  }

  const loginWithGoogle = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "popup",
    redirect_uri: `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID}.web.app/login`,
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

            // 3. Get user info and update context
            const userInfoResponse = await authService.getUserGoogleInfo(
              responseData.access_token
            );

            if (userInfoResponse?.data) {
              const userData = userInfoResponse.data;
              login({
                id: userData.sub,
                email: userData.email,
                name: userData.name,
                picture: userData.picture,
                given_name: userData.given_name,
                family_name: userData.family_name,
                email_verified: userData.email_verified,
              });
            }

            // 4. get new access token before expires
            const refreshTime = expiresInSeconds * 0.9 * 1000; // ms
            getNewRefreshToken(responseData.refresh_token, refreshTime);

            navigate("/products", { replace: true });
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
    navigate("/login");
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

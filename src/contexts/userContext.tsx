import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { authService } from "../services/auth.service";

interface IUser {
  id: string | null;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  email_verified: string;
  isAuthenticated: boolean;
}

interface IUserContextValue {
  userContext: IUser;
  setUserContext: React.Dispatch<React.SetStateAction<IUser>>;
}

export const initialUserContext: IUser = {
  id: null,
  email: "",
  name: "",
  picture: "",
  given_name: "",
  family_name: "",
  email_verified: "",
  isAuthenticated: false,
};

const UserContext = createContext<IUserContextValue>({
  userContext: initialUserContext,
  setUserContext: () => {},
});

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser>(initialUserContext);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      
      authService
        .getUserGoogleInfo(accessToken)
        .then((res) => {
          if (res.data) {
            const userData = res.data;
            setUser({
              id: userData.sub,
              email: userData.email,
              name: userData.name,
              picture: userData.picture,
              given_name: userData.given_name,
              family_name: userData.family_name,
              email_verified: userData.email_verified,
              isAuthenticated: true,
            });
          }
        })
        .catch((err) => {
          console.error("Invalid token or failed to fetch user info", err);
          setUser(initialUserContext);
        });
    }
  }, []);

  const contextValue = useMemo(
    () => ({ userContext: user, setUserContext: setUser }),
    [user]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);

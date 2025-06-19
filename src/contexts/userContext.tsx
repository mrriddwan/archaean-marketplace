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
  isLoading: boolean;
  login: (userData: Partial<IUser>) => void;
  logout: () => void;
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
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser>(initialUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const accessToken = Cookies.get("accessToken");
        const refreshToken = Cookies.get("refreshToken");

        if (accessToken && refreshToken) {
          const res = await authService.getUserGoogleInfo(accessToken);
          
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
        } else {
         
          setUser(initialUserContext);
        }
      } catch (err) {
        console.error("Invalid token or failed to fetch user info", err);
        logout()
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData: Partial<IUser>) => {
    setUser(prev => ({
      ...prev,
      ...userData,
      isAuthenticated: true,
    }));
  };

  const logout = () => {
    setUser(initialUserContext);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  };

  const contextValue = useMemo(
    () => ({ 
      userContext: user, 
      setUserContext: setUser, 
      isLoading,
      login,
      logout 
    }),
    [user, isLoading]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
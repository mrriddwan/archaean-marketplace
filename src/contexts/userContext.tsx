import { createContext, useContext, useMemo, useState } from "react";

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

export const initialUserContext = {
    id: null,
    email: "",
    name: "",
    picture: "",
    given_name: "",
    family_name: "",
    email_verified: "",
    isAuthenticated: false,
  }

const UserContext = createContext<IUserContextValue>({
  userContext: initialUserContext,
  setUserContext: () => {},
});

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser>(initialUserContext);

  const contextValue = useMemo(
    () => ({ userContext: user, setUserContext: setUser }),
    [user]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);

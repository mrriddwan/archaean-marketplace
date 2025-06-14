import { createContext, useContext, useMemo, useState } from "react";

interface IUser {
  user: { email: string } | null;
}

interface IUserContextValue {
  userContext: IUser;
  setUserContext: React.Dispatch<React.SetStateAction<IUser>>;
}

const UserContext = createContext<IUserContextValue>({
  userContext: { user: null },
  setUserContext: () => {},
});

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser>({
    user: null,
  });

  const contextValue = useMemo(
    () => ({ userContext: user, setUserContext: setUser }),
    [user]
  );

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);

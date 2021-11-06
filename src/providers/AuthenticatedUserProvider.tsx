import { User } from '@firebase/auth';
import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react';

export const AuthenticatedUserContext = createContext<{
  user?: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}>({ setUser: () => null });

export const AuthenticatedUserProvider: FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

export const useCurrentUser = (): User | null =>
  useContext(AuthenticatedUserContext).user || null;

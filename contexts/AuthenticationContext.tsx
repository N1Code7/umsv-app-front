import { Dispatch, SetStateAction, createContext } from "react";

interface authenticationContextType {
  isAuthenticated: boolean;
  authToken: string;
  user: {
    id?: number;
    lastName?: string;
    firstName?: string;
    email?: string;
    roles: Array<string>;
  };
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  setAuthToken: Dispatch<SetStateAction<string>>;
  setUser: Dispatch<SetStateAction<object>>;
}

// Partial<> allow properties to be undefined
export const AuthenticationContext = createContext<Partial<authenticationContextType>>({});

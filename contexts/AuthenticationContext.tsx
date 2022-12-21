import { Dispatch, SetStateAction, createContext } from "react";

interface authenticationContextType {
  authToken: string;
  user: { id?: number; lastName?: string; firstName?: string; email?: string };
  setAuthToken: Dispatch<SetStateAction<string>>;
  setUser: Dispatch<SetStateAction<object>>;
}

// Partial<> allow properties to be undefined
export const AuthenticationContext = createContext<Partial<authenticationContextType>>({});

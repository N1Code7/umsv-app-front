import { Dispatch, SetStateAction, createContext } from "react";

interface authTokenContextType {
  authToken: string;
  setAuthToken: Dispatch<SetStateAction<string>>;
}

// Partial<> allow properties to be undefined
export const AuthTokenContext = createContext<Partial<authTokenContextType>>({});

import { Dispatch, SetStateAction, createContext } from "react";

interface authenticationContextType {
  isAuthenticated: boolean;
  authToken: string;
  user: {
    id?: number;
    lastName?: string;
    firstName?: string;
    email?: string;
    birthDate?: string;
    roles?: Array<string>;
    license?: string;
    feather?: string;
    isPlayerTransferred: boolean;
    rankings?: {
      effectiveDate?: string;
      single?: {
        cpph?: string;
        rankName?: string;
        rankNumber?: string;
      };
      double?: { cpph?: string; rankName?: string; rankNumber?: string };
      mixed: { cpph?: string; rankName?: string; rankNumber?: string };
    };
    category?: {
      short?: string;
      long?: string;
      global?: string;
    };
  };
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  setAuthToken: Dispatch<SetStateAction<string>>;
  setUser: Dispatch<SetStateAction<object>>;
}

// Partial<> allow properties to be undefined
export const AuthenticationContext = createContext<Partial<authenticationContextType>>({});

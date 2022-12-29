import { Dispatch, SetStateAction, createContext } from "react";

interface navigationContextType {
  display?: boolean;
  setDisplay?: Dispatch<SetStateAction<boolean>>;
  toggleDisplay?: () => void;
}

export const NavigationContext = createContext<navigationContextType>({});

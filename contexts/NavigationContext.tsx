import { createContext } from "react";

interface contextType {
  display?: boolean
  toggleDisplay?: () => void
}

export const NavigationContext = createContext<contextType>({})
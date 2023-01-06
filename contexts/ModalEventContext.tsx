import { Dispatch, SetStateAction, createContext } from "react";

interface IModalEventContext {
  isModalActive: boolean;
  focusedEvent: {
    startDate?: string;
    endDate?: string;
    content?: string;
    imageUrl?: string;
  };
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
  setFocusedEvent: Dispatch<SetStateAction<object>>;
}

export const ModalEventContext = createContext<Partial<IModalEventContext>>({});

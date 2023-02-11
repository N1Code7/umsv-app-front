import { Dispatch, SetStateAction, createContext } from "react";
import { ITournament } from "../config/interfaces";

interface ISelectedTournamentContext {
  selectedTournament: ITournament;
  setSelectedTournament: Dispatch<SetStateAction<ITournament>>;
}

export const SelectedTournamentContext = createContext<Partial<ISelectedTournamentContext>>({});

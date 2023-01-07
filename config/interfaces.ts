export interface IClubEvent {
  id: number;
  startDate: string;
  endDate: string;
  content: string;
  imageName: string;
  imageUrl: string;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITournament {
  id: number;
  name: string;
  city: string;
  startDate: string;
  endDate: string;
  season: string;
  isTeamCompetition: boolean;
  standardPrice1: number | null;
  standardPrice2: number | null;
  standardPrice3: number | null;
  elitePrice1: number | null;
  elitePrice2: number | null;
  elitePrice3: number | null;
  priceSingle: number | null;
  priceDouble: number | null;
  priceMixed: number | null;
  registrationClosingDate: string;
  randomDraw: string;
  telContact: string;
  emailContact: string;
  registrationMethod: string;
  paymentMethod: string;
  regulationFileName: string | null;
  regulationFileUrl: string | null;
  comment: string;
  createdAt: string;
  updatedAt: string;
  tournamentRegistrations: Array<ITournamentRegistration>;
}

export interface ITournamentRegistration {
  id: number;
  userId: number;
  tournamentId: number;
  requestState: string;
  hasParticipated: boolean;
  participationSingle: boolean;
  participationDouble: boolean;
  participationMixed: boolean;
  doublePartnerName: string;
  doublePartnerClub: string;
  mixedPartnerName: string;
  mixedPartnerClub: string;
  singleStageReached: string;
  doubleStageReached: string;
  mixedStageReached: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

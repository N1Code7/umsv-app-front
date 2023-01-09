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
  standardPrice1: number;
  standardPrice2: number;
  standardPrice3: number;
  elitePrice1: number;
  elitePrice2: number;
  elitePrice3: number;
  priceSingle: number;
  priceDouble: number;
  priceMixed: number;
  registrationClosingDate: string;
  randomDraw: string;
  telContact: string;
  emailContact: string;
  registrationMethod: string;
  paymentMethod: string;
  regulationFileName: string;
  regulationFileUrl: string;
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

export interface User {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  roles: Array<string>;
  FFBadStats: Array<{
    rankingsDate: string;
    license: string;
    birthDate: string;
    categoryGlobal: string;
    categoryShort: string;
    categoryLong: string;
    isPlayerTransferred: boolean;
    feather: string;
    singleCPPH: string;
    singleRankName: string;
    singleRankNumber: string;
    doubleCPPH: string;
    doubleRankName: string;
    doubleRankNumber: string;
    mixedCPPH: string;
    mixedRankName: string;
    mixedRankNumber: string;
  }>;
}

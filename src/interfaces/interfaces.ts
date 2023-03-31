export interface IAuth {
  accessToken: string;
  isAuthenticated: boolean;
}

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

export interface IUser {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  roles: Array<string>;
  gender?: string;
  avatarFileName?: string;
  avatarFileUrl?: string;
  birthDate?: string;
  state?: string;
  validatedAccount?: boolean;
  FFBadStats?: Array<IFFBadStats>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITournament {
  id: number;
  name: string | null;
  city: string;
  startDate: Date;
  endDate: Date | null;
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
  registrationClosingDate: Date | null;
  randomDraw: Date | null;
  telContact: string | null;
  emailContact: string | null;
  registrationMethod: string | null;
  paymentMethod: string | null;
  regulationFileName: string | null;
  regulationFileUrl: string | null;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  tournamentRegistrations: Array<ITournamentRegistration>;
}

export interface ITournamentRegistration {
  id: number;
  user: IUser;
  userId: number;
  userLastName: string;
  userFirstName: string;
  userEmail: string;
  tournament: ITournament;
  tournamentName: string;
  tournamentCity: string;
  tournamentStartDate: string;
  tournamentEndDate: string;
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
  result: IResult;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface IResult {
  id: number;
  areResultsValidated: boolean;
  singleStageReached: string;
  doubleStageReached: string;
  mixedStageReached: string;
  comment: string;
}

export interface IFFBadStats {
  CPPHSum: string;
  apiId: number;
  birthDate: string;
  birthLastName: string;
  categoryGlobal: string;
  categoryShort: string;
  categoryLong: string;
  clubAcronym: string;
  clubDepartment: string;
  clubId: string;
  clubName: string;
  clubReference: string;
  country: string;
  countryISO: string;
  doubleCPPH: string;
  doubleRankName: string;
  doubleRankNumber: string;
  extractionDate: string;
  feather: string;
  firstName: string;
  id: number;
  isDataPlayerPublic: boolean;
  isPlayerActive: boolean;
  isPlayerTransferred: boolean;
  lastName: string;
  license: string;
  mixedCPPH: string;
  mixedRankName: string;
  mixedRankNumber: string;
  nationality: string;
  rankingsDate: string;
  season: string;
  singleCPPH: string;
  singleRankName: string;
  singleRankNumber: string;
  weekNumber: number;
  year: number;
}

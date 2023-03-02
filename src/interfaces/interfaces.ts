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

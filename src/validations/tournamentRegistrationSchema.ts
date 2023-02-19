import * as yup from "yup";

export const newTournamentRegistrationSchema = yup.object({
  chooseNewTournament: yup.boolean().required(),
  registrationSelectTournament: yup
    .string()
    .test(
      "isTournamentSelected",
      'Vous devez sélectionner un tournoi parmi la liste proposée (sinon utilisez le formulaire détaillé en cliquant sur "Nouveau tournoi"',
      (value, context) => (!context.parent.chooseNewTournament ? value !== "null" : true)
    ),
  registrationName: yup
    .string()
    .notRequired()
    .test(
      "isContainingSpecialChar",
      "Le nom du tournoi ne doit pas contenir de caractères spéciaux.",
      (value, context) => (context.parent.chooseNewTournament ? !value?.match(/[<>*+€$§%]+/) : true)
    ),
  registrationCity: yup
    .string()
    .test(
      "isRequiredIfNewTournament",
      "Le nom de la ville du tournoi est requis.",
      (value, context) => (context.parent.chooseNewTournament ? (value ? true : false) : true)
    )
    .test(
      "isContainingMinChar",
      "La ville du tournoi doit posséder 3 caractères minimum.",
      (value, context) => (context.parent.chooseNewTournament && value ? value?.length >= 3 : true)
    ),
  registrationStartDate: yup
    .string()
    .test(
      "isRequiredIfNewTournament",
      "La date de début du tournoi est requise.",
      (value, context) => (context.parent.chooseNewTournament ? (value ? true : false) : true)
    )
    .test(
      "isLaterThanToday",
      "La date de début du tournoi ne peut être antérieure à aujourd'hui.",
      (value, context) =>
        context.parent.chooseNewTournament && value
          ? (Number(new Date()) - Number(new Date(value!))) / (1000 * 3600 * 24) < 1
          : true
    ),
  registrationEndDate: yup
    .string()
    .test(
      "isLaterThanStartDate",
      "La date de fin du tournoi ne peut être antérieure à celle de la date de début",
      (value, context) =>
        context.parent.chooseNewTournament && value
          ? new Date(value) > new Date(context.parent.registrationStartDate)
          : true
    ),
  checkboxes: yup
    .array(yup.boolean().nullable())
    .test("isOneTableSelecting", "Un tableau doit être au minimum sélectionné.", (value, context) =>
      value?.every((elt) => !elt) ? false : true
    ),
  registrationDoublePartnerName: yup
    .string()
    .notRequired()
    .test(
      "isContainingSpecialChar",
      "Le nom du partenaire de double ne doit pas contenir de caractères spéciaux.",
      (value, context) => !value?.match(/[<>*+€$§%]+/)
    ),
  registrationDoublePartnerClub: yup
    .string()
    .notRequired()
    .test(
      "isContainingSpecialChar",
      "Le club du partenaire de double ne doit pas contenir de caractères spéciaux.",
      (value, context) => !value?.match(/[<>*+€$§%]+/)
    ),
  registrationMixedPartnerName: yup
    .string()
    .notRequired()
    .test(
      "isContainingSpecialChar",
      "Le nom du partenaire de mixte ne doit pas contenir de caractères spéciaux.",
      (value, context) => !value?.match(/[<>*+€$§%]+/)
    ),
  registrationMixedPartnerClub: yup
    .string()
    .notRequired()
    .test(
      "isContainingSpecialChar",
      "Le club du partenaire de mixte ne doit pas contenir de caractères spéciaux.",
      (value, context) => !value?.match(/[<>*+€$§%]+/)
    ),
});

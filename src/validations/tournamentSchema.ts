import * as yup from "yup";

export const tournamentSchema = yup.object({
  name: yup.string().notRequired(),
  city: yup.string().required(),
  startDate: yup.date().required().min(new Date()),
  endDate: yup
    .date()
    .notRequired()
    .test(
      "isLaterThanStartDate",
      "La date de fin du tournoi doit être postérieure à la date de début.",
      (value, context) => (value ? value > context.parent.startDate : true)
    ),
  isTeamCompetition: yup.boolean().notRequired(),
  standardPrice1: yup.number().notRequired().positive("Le prix ne peut être négatif."),
  standardPrice2: yup.number().notRequired().positive().moreThan(yup.ref("standardPrice1")),
  standardPrice3: yup.number().notRequired().positive().moreThan(yup.ref("standardPrice2")),
  elitePrice1: yup.number().notRequired().positive("Le prix ne peut être négatif."),
  elitePrice2: yup
    .number()
    .notRequired()
    .positive("Le prix ne peut être négatif.")
    .moreThan(yup.ref("elitePrice1")),
  elitePrice3: yup
    .number()
    .notRequired()
    .positive("Le prix ne peut être négatif.")
    .moreThan(yup.ref("elitePrice2")),
  priceSingle: yup.number().notRequired().positive("Le prix ne peut être négatif."),
  priceDouble: yup.number().notRequired().positive("Le prix ne peut être négatif."),
  priceMixed: yup.number().notRequired().positive("Le prix ne peut être négatif."),
  registrationClosingDate: yup
    .date()
    .notRequired()
    .test(
      "isBeforeStartDate",
      "La date de limite d'inscription doit être antérieure à la date de début du tournoi",
      (value, context) => (value ? value < context.parent.startDate : true)
    ),
  randomDraw: yup
    .date()
    .notRequired()
    .test(
      "isBetweenClosingDateAndStartDate",
      "La date de tirage au sort doit être comprise entre la date de limite d'inscription et le tirage au sort.",
      (value, context) =>
        value
          ? value > context.parent.registrationClosingDate && value < context.parent.startDate
          : true
    ),
  emailContact: yup
    .string()
    .notRequired()
    .test("isComplyingEmail", "L'email saisi n'est pas conforme.", (value, context) =>
      value ? /^[a-z0-9-\-\.]+@[a-z0-9-]+\.[a-z0-9]{2,5}$/.test(value) : true
    ),
  telContact: yup
    .string()
    .notRequired()
    .test(
      "isComplyingTelNumber",
      "Le numéro de téléphone saisi n'est pas conforme.",
      (value, context) => (value ? /^0[0-9]{9}$/.test(value) : true)
    ),
  // .matches(/0[0-9]{9}/, "Le numéro de téléphone n'est pas conforme"),
  registrationMethod: yup
    .string()
    .notRequired()
    .oneOf(
      ["Badnet / eBad", "Courrier", "Email", "Site interne"],
      "La méthode d'inscription renseignée n'est pas connue."
    ),
  paymentMethod: yup
    .string()
    .notRequired()
    .oneOf(
      ["Portefeuille Badnet", "CB", "Virement", "Chèque", "Espèces"],
      "Le moyen de paiement n'est pas connu."
    ),
  regulationUrl: yup.string().notRequired().url(),
  comment: yup.string().notRequired(),
});

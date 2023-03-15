import * as yup from "yup";

export const userInfoSchema = yup.object({
  email: yup
    .string()
    .notRequired()
    .email("L'email saisi n'est pas conforme.")
    .test("emailContainsAtSymbol", "L'email saisi n'est pas conforme.", (value, context) =>
      value ? !!value?.match(/^[a-z0-9-\-]+@[a-z0-9-]+\.[a-z0-9]{2,5}$/) : true
    ),
  previousPassword: yup.string().notRequired(),
  password: yup
    .string()
    .min(6, "Votre mot de passe doit contenir au minimum 6 caractères.")
    .notRequired()
    .test(
      "allPasswordInputsRequired",
      'Les champs "Précédent mot de passe" et "Confirmation" sont requis pour mettre à jour votre mot de passe',
      (value, context) =>
        value ? context.parent.previousPassword && context.parent.confirmPassword : true
    ),
  confirmPassword: yup
    .string()
    .min(6)
    .notRequired()
    .test(
      "isIdenticalToPassword",
      "Vos mots de passe ne correspondent pas.",
      (value, context) => value === context.parent.password
    ),
});

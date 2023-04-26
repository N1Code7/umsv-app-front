import * as yup from "yup";

export const eventSchema = yup.object({
  startDate: yup.date().required(),
  endDate: yup.date().required(),
  content: yup.string().required(),
  visible: yup.boolean(),
});

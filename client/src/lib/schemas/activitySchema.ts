import { z } from "zod";
import { requiredString } from "../util/uitl";

export const activitySchema = z.object({
  title: requiredString("Title"),
  description: requiredString("Description"),
  category: requiredString("Category"),
  //input type of all z.coerce schemas is unknown by default.
  //To specify a more specific input type, pass a generic parameter
  date: z.coerce
    .date<Date>({ error: "Date is required" })
    .min(new Date(), { error: "Date must be in the future" }),
  //refine is a custom validation, you must return a falsy value to signal failure
  location: z.object(
    {
      venue: requiredString("Venue"),
      city: z.string().optional(),
      latitude: z.coerce.number<number>(),
      longitude: z.coerce.number<number>(),
    },
    {
      error: "Please type and select the location from the list",
    }
  ),
  // .refine((val) => typeof val !== "string", {
  //   error: "Please type and select the location from the list",
  // }),
});
// export type ActivitySchema = z.input<typeof activitySchema>;
export type ActivitySchema = z.infer<typeof activitySchema>;
//input is the type before parsing, type user provide
//infer is the type after parsing, validate / coerce, this is the type we usually use in applications

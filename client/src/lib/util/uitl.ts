import { format, type DateArg } from "date-fns";
import z from "zod";

export function formatDate(date: DateArg<Date>) {
  return format(date, "dd MMM yyyy h:mm a");
}

export const requiredString = (fieldName: string) =>
  z
    .string({
      error: (issue) =>
        issue.input === undefined ? `${fieldName} is required` : "Not a string",
    })
    .trim()
    .min(1, { error: `${fieldName} is required` });

//Just when using control input (control input because using useController to create reusable input) you must need
//{
//   error: (issue) =>
//     issue.input === undefined ? `${fieldName} is required` : "Not a string",
// }
// to customize message for undefined input - default message is "Expected string, received undefined"

//Zod will convert the input value to a string before validating, because HTML input always returns a string.
//=> Input 123 not going to fail "not a string" error

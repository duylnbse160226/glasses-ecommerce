import { TextField, type TextFieldProps } from "@mui/material";
import {
  useController,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";

//& in typescript is INTERSECTION TYPE
// Type A & Type B = Type that has all properties of A and B
type Props<T extends FieldValues> = {} & UseControllerProps<T> & TextFieldProps;
//extends FieldValues just to ensure:
//Fields must be string keys
//Not random types like number, boolean, array…
//Not same definition as inherited types in OOP
//extends in ts is constraint type
export default function TextInput<T extends FieldValues>(props: Props<T>) {
  const { field, fieldState } = useController({ ...props });
  return (
    <TextField
      {...props}
      {...field}
      value={field.value || ""}
      fullWidth
      variant="outlined"
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    />
  );
}

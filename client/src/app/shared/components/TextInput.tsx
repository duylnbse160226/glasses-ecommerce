import { TextField, type TextFieldProps } from "@mui/material";
import {
  useController,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";

// Intersection type: Props of react-hook-form + MUI TextField
type Props<T extends FieldValues> =
  UseControllerProps<T> &
  TextFieldProps & {
    hideError?: boolean; // ✅ THÊM
  };

export default function TextInput<T extends FieldValues>({
  hideError = false,
  ...props
}: Props<T>) {
  const { field, fieldState } = useController({ ...props });

  return (
    <TextField
      {...props}
      {...field}
      value={field.value ?? ""}
      fullWidth
      variant="outlined"
      error={!!fieldState.error}
      helperText={
        hideError ? undefined : fieldState.error?.message
      }
    />
  );
}

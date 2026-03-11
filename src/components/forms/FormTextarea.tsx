import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface FormTextareaProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

export function FormTextarea<T extends FieldValues>({ form, name, label, placeholder, disabled, rows }: FormTextareaProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} disabled={disabled} rows={rows} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

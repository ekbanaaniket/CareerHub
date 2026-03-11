import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FormSwitchProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  description?: string;
  disabled?: boolean;
}

export function FormSwitch<T extends FieldValues>({ form, name, label, description, disabled }: FormSwitchProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center justify-between">
          <div>
            <Label>{label}</Label>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} disabled={disabled} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

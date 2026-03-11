import { useForm, UseFormReturn, FieldValues, DefaultValues, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReusableFormProps<T extends FieldValues> {
  schema: ZodSchema<T>;
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: (form: UseFormReturn<T>) => React.ReactNode;
  submitLabel?: string;
  secondaryAction?: { label: string; onClick: () => void };
  className?: string;
  isLoading?: boolean;
}

export function ReusableForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  submitLabel = "Submit",
  secondaryAction,
  className,
  isLoading,
}: ReusableFormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4", className)}>
        {children(form)}
        <div className="flex gap-2 pt-2">
          {secondaryAction && (
            <Button type="button" variant="outline" className="flex-1" onClick={secondaryAction.onClick} disabled={isLoading}>
              {secondaryAction.label}
            </Button>
          )}
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

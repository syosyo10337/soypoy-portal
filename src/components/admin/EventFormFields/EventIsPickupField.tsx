"use client";

import type { Control, FieldValues, Path, PathValue } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/shadcn/field";

interface EventIsPickupFieldProps<T extends FieldValues> {
  control: Control<T>;
  defaultValue?: boolean;
}

export function EventIsPickupField<T extends FieldValues>({
  control,
  defaultValue,
}: EventIsPickupFieldProps<T>) {
  return (
    <Controller
      name={"isPickup" as Path<T>}
      control={control}
      defaultValue={defaultValue as PathValue<T, Path<T>>}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <div className="flex items-center gap-2">
            <Checkbox
              id="isPickup"
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
              aria-invalid={fieldState.invalid}
            />
            <FieldLabel htmlFor="isPickup" className="cursor-pointer">
              ピックアップに表示
            </FieldLabel>
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

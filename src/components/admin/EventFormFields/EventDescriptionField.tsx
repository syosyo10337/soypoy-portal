"use client";

import type { Control, FieldValues, Path, PathValue } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/shadcn/field";
import { Textarea } from "@/components/shadcn/textarea";

interface EventDescriptionFieldProps<T extends FieldValues> {
  control: Control<T>;
  defaultValue?: string;
}

export function EventDescriptionField<T extends FieldValues>({
  control,
  defaultValue,
}: EventDescriptionFieldProps<T>) {
  return (
    <Controller
      name={"description" as Path<T>}
      control={control}
      defaultValue={defaultValue as PathValue<T, Path<T>>}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="description">説明</FieldLabel>
          <Textarea
            {...field}
            id="description"
            rows={5}
            aria-invalid={fieldState.invalid}
            placeholder="イベントの説明を入力"
            rows={4}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

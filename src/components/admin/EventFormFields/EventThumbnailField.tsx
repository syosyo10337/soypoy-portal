"use client";

import type { Control, FieldValues, Path, PathValue } from "react-hook-form";
import { Controller } from "react-hook-form";
import { ImageUploader } from "@/components/ImageField";
import { Field, FieldError, FieldLabel } from "@/components/shadcn/field";

interface EventThumbnailFieldProps<T extends FieldValues> {
  control: Control<T>;
  defaultValue?: string | null;
}

export function EventThumbnailField<T extends FieldValues>({
  control,
  defaultValue,
}: EventThumbnailFieldProps<T>) {
  return (
    <Controller
      name={"thumbnail" as Path<T>}
      control={control}
      defaultValue={defaultValue as PathValue<T, Path<T>>}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>サムネイルURL</FieldLabel>
          <ImageUploader
            value={field.value}
            onChange={(value) => field.onChange(value)}
            aspectRatio="aspect-insta"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

"use client";

import type { Control, FieldValues, Path, PathValue } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";

interface EventTimeFieldProps<T extends FieldValues> {
  control: Control<T>;
  defaultValue?: string;
}

/**
 * イベント開始時間入力フィールド
 */
export function EventTimeField<T extends FieldValues>({
  control,
  defaultValue,
}: EventTimeFieldProps<T>) {
  return (
    <Controller
      name={"time" as Path<T>}
      control={control}
      defaultValue={defaultValue as PathValue<T, Path<T>>}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="time">開始時間</FieldLabel>
          <Input
            {...field}
            id="time"
            type="time"
            aria-invalid={fieldState.invalid}
            placeholder="開始時間を入力"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

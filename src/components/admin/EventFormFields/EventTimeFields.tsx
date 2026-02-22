"use client";

import type { Control, FieldValues, Path, PathValue } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";

interface EventTimeFieldsProps<T extends FieldValues> {
  control: Control<T>;
  defaultOpenTime?: string | null;
  defaultStartTime?: string | null;
}

export function EventTimeFields<T extends FieldValues>({
  control,
  defaultOpenTime,
  defaultStartTime,
}: EventTimeFieldsProps<T>) {
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">時間</span>
      <div className="grid grid-cols-2 gap-3">
        <Controller
          name={"openTime" as Path<T>}
          control={control}
          defaultValue={(defaultOpenTime ?? "") as PathValue<T, Path<T>>}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="openTime">開場</FieldLabel>
              <Input
                {...field}
                id="openTime"
                type="time"
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name={"startTime" as Path<T>}
          control={control}
          defaultValue={(defaultStartTime ?? "") as PathValue<T, Path<T>>}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="startTime">開始</FieldLabel>
              <Input
                {...field}
                id="startTime"
                type="time"
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </div>
  );
}

"use client";

import type { Control, FieldValues, Path, PathValue } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/shadcn/field";
import { DEFAULT_OPEN_TIME, DEFAULT_START_TIME } from "@/domain/entities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";

/** 30分刻みの時刻選択肢 (10:00〜22:00) */
const TIME_OPTIONS = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
];

interface EventTimeFieldsProps<T extends FieldValues> {
  control: Control<T>;
  defaultOpenTime?: string;
  defaultStartTime?: string;
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
          defaultValue={
            (defaultOpenTime ?? DEFAULT_OPEN_TIME) as PathValue<T, Path<T>>
          }
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="openTime">開場</FieldLabel>
              <TimeSelect
                id="openTime"
                value={field.value}
                onChange={(v) => field.onChange(v as PathValue<T, Path<T>>)}
                invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name={"startTime" as Path<T>}
          control={control}
          defaultValue={
            (defaultStartTime ?? DEFAULT_START_TIME) as PathValue<T, Path<T>>
          }
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="startTime">開始</FieldLabel>
              <TimeSelect
                id="startTime"
                value={field.value}
                onChange={(v) => field.onChange(v as PathValue<T, Path<T>>)}
                invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </div>
  );
}

function TimeSelect({
  id,
  value,
  onChange,
  invalid,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} aria-invalid={invalid} className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {TIME_OPTIONS.map((t) => (
          <SelectItem key={t} value={t}>
            {t}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

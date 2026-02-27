"use client";

import { useCallback } from "react";
import type { Control, FieldValues, Path, PathValue } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { PRESET_VENUES } from "@/domain/entities";

const CUSTOM_VALUE = "custom";

/**
 * defaultValueからSelect用の値を導出する
 * - preset → presetId (例: "soypoy")
 * - custom → "custom"
 * - 未設定 → ""
 */
function deriveSelectValue(
  defaultValue?: { type: string; presetId?: string } | null,
): string {
  if (!defaultValue?.type) return "";
  if (defaultValue.type === "preset" && defaultValue.presetId)
    return defaultValue.presetId;
  return CUSTOM_VALUE;
}

interface EventVenueFieldProps<T extends FieldValues> {
  control: Control<T>;
  defaultValue?: {
    type: string;
    presetId?: string;
    customName?: string;
    instagramHandle?: string;
  } | null;
}

export function EventVenueField<T extends FieldValues>({
  control,
  defaultValue,
}: EventVenueFieldProps<T>) {
  const venueType = useWatch({
    control,
    name: "venue.type" as Path<T>,
    defaultValue: (defaultValue?.type ?? "") as PathValue<T, Path<T>>,
  });

  return (
    <div className="space-y-3">
      <VenueSelect control={control} defaultValue={defaultValue} />

      {venueType === CUSTOM_VALUE && (
        <>
          <Controller
            name={"venue.customName" as Path<T>}
            control={control}
            defaultValue={
              (defaultValue?.customName ?? "") as PathValue<T, Path<T>>
            }
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="venue-custom-name">会場名</FieldLabel>
                <Input
                  {...field}
                  id="venue-custom-name"
                  value={field.value ?? ""}
                  placeholder="会場名を入力"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name={"venue.instagramHandle" as Path<T>}
            control={control}
            defaultValue={
              (defaultValue?.instagramHandle ?? "") as PathValue<T, Path<T>>
            }
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="venue-instagram">
                  Instagram ハンドル
                </FieldLabel>
                <Input
                  {...field}
                  id="venue-instagram"
                  value={field.value ?? ""}
                  placeholder="@なしで入力"
                />
              </Field>
            )}
          />
        </>
      )}
    </div>
  );
}

/**
 * 1つのSelectでプリセット会場 + "その他" を選べるコンポーネント
 * 選択値に応じて venue.type と venue.presetId を同時にセットする
 */
function VenueSelect<T extends FieldValues>({
  control,
  defaultValue,
}: {
  control: Control<T>;
  defaultValue?: { type: string; presetId?: string } | null;
}) {
  const initialValue = deriveSelectValue(defaultValue);

  const handleChange = useCallback(
    (
      value: string,
      onChange: (value: PathValue<T, Path<T>>) => void,
      setPresetId: (value: PathValue<T, Path<T>>) => void,
    ) => {
      if (value === CUSTOM_VALUE) {
        onChange(CUSTOM_VALUE as PathValue<T, Path<T>>);
        setPresetId("" as PathValue<T, Path<T>>);
      } else {
        onChange("preset" as PathValue<T, Path<T>>);
        setPresetId(value as PathValue<T, Path<T>>);
      }
    },
    [],
  );

  return (
    <Controller
      name={"venue.presetId" as Path<T>}
      control={control}
      defaultValue={(defaultValue?.presetId ?? "") as PathValue<T, Path<T>>}
      render={({ field: presetIdField }) => (
        <Controller
          name={"venue.type" as Path<T>}
          control={control}
          defaultValue={(defaultValue?.type ?? "") as PathValue<T, Path<T>>}
          render={({ field: typeField, fieldState }) => {
            const selectValue =
              typeField.value === "preset" && presetIdField.value
                ? (presetIdField.value as string)
                : typeField.value === CUSTOM_VALUE
                  ? CUSTOM_VALUE
                  : initialValue;

            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="venue">会場</FieldLabel>
                <Select
                  value={selectValue}
                  onValueChange={(v) =>
                    handleChange(v, typeField.onChange, presetIdField.onChange)
                  }
                >
                  <SelectTrigger id="venue" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PRESET_VENUES).map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name}
                      </SelectItem>
                    ))}
                    <SelectItem value={CUSTOM_VALUE}>
                      その他（手入力）
                    </SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />
      )}
    />
  );
}

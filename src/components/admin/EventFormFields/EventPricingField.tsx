"use client";

import { PlusIcon, TrashIcon } from "lucide-react";
import type {
  ArrayPath,
  Control,
  FieldArray,
  FieldValues,
  Path,
} from "react-hook-form";
import { Controller, useFieldArray } from "react-hook-form";
import { Button } from "@/components/shadcn/button";
import { FieldError } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";

interface EventPricingFieldProps<T extends FieldValues> {
  control: Control<T>;
}

export function EventPricingField<T extends FieldValues>({
  control,
}: EventPricingFieldProps<T>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "pricing" as ArrayPath<T>,
  });

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">料金</span>
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <div className="grid grid-cols-3 gap-2 flex-1">
              <Controller
                name={`pricing.${index}.label` as Path<T>}
                control={control}
                render={({ field: f, fieldState }) => (
                  <div>
                    <Input
                      {...f}
                      placeholder="ラベル（例: 前売り）"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                )}
              />
              <Controller
                name={`pricing.${index}.amount` as Path<T>}
                control={control}
                render={({ field: f, fieldState }) => (
                  <div>
                    <Input
                      {...f}
                      type="number"
                      min={0}
                      placeholder="金額"
                      onChange={(e) => {
                        const v = e.target.value;
                        f.onChange(v === "" ? undefined : Number(v));
                      }}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                )}
              />
              <Controller
                name={`pricing.${index}.note` as Path<T>}
                control={control}
                render={({ field: f }) => (
                  <Input
                    {...f}
                    placeholder="備考（例: ワンドリンク付き）"
                    value={f.value ?? ""}
                  />
                )}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              aria-label={`${index + 1}件目の料金を削除`}
            >
              <TrashIcon />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          append({
            label: "",
            amount: 0,
            note: "",
          } as FieldArray<T, ArrayPath<T>>)
        }
      >
        <PlusIcon />
        料金を追加
      </Button>
    </div>
  );
}

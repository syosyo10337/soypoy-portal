"use client";

import { PlusIcon, TrashIcon } from "lucide-react";
import type {
  ArrayPath,
  Control,
  FieldArray,
  FieldValues,
} from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { Path } from "react-hook-form";
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
                      onChange={(e) => f.onChange(Number(e.target.value))}
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
                    placeholder="備考（任意）"
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

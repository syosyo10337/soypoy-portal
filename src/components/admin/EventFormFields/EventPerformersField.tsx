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

interface EventPerformersFieldProps<T extends FieldValues> {
  control: Control<T>;
}

export function EventPerformersField<T extends FieldValues>({
  control,
}: EventPerformersFieldProps<T>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "performers" as ArrayPath<T>,
  });

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">出演者</span>
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <div className="grid grid-cols-3 gap-2 flex-1">
              <Controller
                name={`performers.${index}.name` as Path<T>}
                control={control}
                render={({ field: f, fieldState }) => (
                  <div>
                    <Input
                      {...f}
                      placeholder="名前"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                )}
              />
              <Controller
                name={`performers.${index}.role` as Path<T>}
                control={control}
                render={({ field: f }) => (
                  <Input
                    {...f}
                    placeholder="役割（任意）"
                    value={f.value ?? ""}
                  />
                )}
              />
              <Controller
                name={`performers.${index}.instagramHandle` as Path<T>}
                control={control}
                render={({ field: f }) => (
                  <Input
                    {...f}
                    placeholder="Instagram（任意）"
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
              aria-label={`${index + 1}件目の出演者を削除`}
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
            name: "",
            role: "",
            instagramHandle: "",
          } as FieldArray<T, ArrayPath<T>>)
        }
      >
        <PlusIcon />
        出演者を追加
      </Button>
    </div>
  );
}

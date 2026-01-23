"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/shadcn/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { eventPublicationStatusLabel } from "@/constant/eventPublicationStatusLabel";
import { PublicationStatus } from "@/domain/entities";
import type {
  CreateEventFormData,
  UpdateEventFormData,
} from "@/domain/validation";

interface EventPublicationStatusFieldProps {
  control: Control<CreateEventFormData> | Control<UpdateEventFormData>;
  defaultValue?: PublicationStatus;
}

export function EventPublicationStatusField({
  control,
  defaultValue,
}: EventPublicationStatusFieldProps) {
  return (
    <Controller
      name="publicationStatus"
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="publicationStatus">公開ステータス</FieldLabel>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger
              id="publicationStatus"
              aria-invalid={fieldState.invalid}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PublicationStatus.Draft}>
                {eventPublicationStatusLabel[PublicationStatus.Draft]}
              </SelectItem>
              <SelectItem value={PublicationStatus.Published}>
                {eventPublicationStatusLabel[PublicationStatus.Published]}
              </SelectItem>
              <SelectItem value={PublicationStatus.Archived}>
                {eventPublicationStatusLabel[PublicationStatus.Archived]}
              </SelectItem>
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

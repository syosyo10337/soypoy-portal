"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import {
  EventDateField,
  EventDescriptionField,
  EventIsPickupField,
  EventThumbnailField,
  EventTimeField,
  EventTitleField,
  EventTypeField,
} from "@/components/admin/EventFormFields";
import {
  CreateView,
  CreateViewHeader,
} from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import type { EventEntity } from "@/domain/entities";
import {
  type CreateEventFormData,
  createEventFormSchema,
} from "@/domain/validation";
import { useImageUpload } from "../../_hooks/useImageUpload";

export function CreateEventForm() {
  const { isFileUploading, uploadIfNeeded } = useImageUpload();

  const {
    refineCore: { onFinish },
    handleSubmit,
    control,
    setError,
  } = useForm<EventEntity, HttpError, CreateEventFormData>({
    resolver: zodResolver(createEventFormSchema),
    refineCoreProps: {
      resource: "events",
      action: "create",
      redirect: "list",
    },
    // NOTE: to avoid uncontrolled component
    // cf. https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      type: undefined,
      thumbnail: undefined,
      isPickup: false,
    },
  });

  const onSubmit = async ({ time, ...data }: CreateEventFormData) => {
    try {
      const submitData = await uploadIfNeeded(data, setError);
      if (!submitData) return; // アップロード失敗

      // 時間が入力されている場合、日付と結合してISO8601形式にする
      if (time) {
        submitData.date = `${submitData.date}T${time}`;
      }

      await onFinish(submitData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <CreateView>
      <CreateViewHeader />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>イベント情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <EventTitleField control={control} />
                <EventDateField control={control} />
                <EventTimeField control={control} />
                <EventTypeField control={control} />
                <EventIsPickupField control={control} />
                <EventDescriptionField control={control} />
              </div>
              <div>
                <EventThumbnailField control={control} />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={isFileUploading}>
                {isFileUploading ? "画像をアップロード中..." : "作成"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </CreateView>
  );
}

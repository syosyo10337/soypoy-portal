"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import {
  EventDateField,
  EventDescriptionField,
  EventHashtagsField,
  EventIsPickupField,
  EventPerformersField,
  EventPricingField,
  EventThumbnailField,
  EventTimeFields,
  EventTitleField,
  EventTypeField,
  EventVenueField,
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

/**
 * 空文字列をnullに変換し、空配列をnullに変換する
 */
function cleanFormData(data: CreateEventFormData): CreateEventFormData {
  return {
    ...data,
    openTime: data.openTime || null,
    startTime: data.startTime || null,
    pricing: data.pricing?.length ? data.pricing : null,
    venue: data.venue?.type ? data.venue : null,
    performers: data.performers?.length ? data.performers : null,
    hashtags: data.hashtags?.length ? data.hashtags : null,
  };
}

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
      type: undefined,
      thumbnail: undefined,
      isPickup: false,
      openTime: "",
      startTime: "",
      pricing: [],
      venue: undefined,
      performers: [],
      hashtags: [],
    },
  });

  const onSubmit = async (data: CreateEventFormData) => {
    try {
      const cleaned = cleanFormData(data);
      const submitData = await uploadIfNeeded(cleaned, setError);
      if (!submitData) return; // アップロード失敗

      await onFinish(submitData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <CreateView>
      <CreateViewHeader />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>イベント基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <EventTitleField control={control} />
                <EventDateField control={control} />
                <EventTimeFields control={control} />
                <EventTypeField control={control} />
                <EventIsPickupField control={control} />
              </div>
              <div>
                <EventThumbnailField control={control} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>イベント詳細</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <EventDescriptionField control={control} />
            <EventPricingField control={control} />
            <EventVenueField control={control} />
            <EventPerformersField control={control} />
            <EventHashtagsField control={control} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isFileUploading}>
            {isFileUploading ? "画像をアップロード中..." : "作成"}
          </Button>
        </div>
      </form>
    </CreateView>
  );
}

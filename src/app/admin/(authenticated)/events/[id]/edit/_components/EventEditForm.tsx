"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useParams } from "next/navigation";
import {
  EventDateField,
  EventDescriptionField,
  EventHashtagsField,
  EventIsPickupField,
  EventPerformersField,
  EventPricingField,
  EventPublicationStatusField,
  EventThumbnailField,
  EventTimeFields,
  EventTitleField,
  EventTypeField,
  EventVenueField,
} from "@/components/admin/EventFormFields";
import {
  EditView,
  EditViewHeader,
} from "@/components/refine-ui/views/edit-view";
import { Button } from "@/components/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { DEFAULT_OPEN_TIME, DEFAULT_START_TIME } from "@/domain/entities";
import type { EventEntity } from "@/domain/entities";
import {
  type UpdateEventFormData,
  updateEventFormSchema,
} from "@/domain/validation";
import { useImageUpload } from "../../../_hooks/useImageUpload";
import { EventError } from "../../_components/EventError";
import { EventLoading } from "../../_components/EventLoading";
import { EventNotFound } from "../../_components/EventNotFound";

/**
 * 空文字列をnullに変換し、空配列をnullに変換する
 */
function cleanFormData(data: UpdateEventFormData): UpdateEventFormData {
  return {
    ...data,
    pricing: data.pricing?.length ? data.pricing : null,
    venue: data.venue?.type ? data.venue : null,
    performers: data.performers?.length ? data.performers : null,
    hashtags: data.hashtags?.length ? data.hashtags : null,
  };
}

/**
 * イベント編集フォーム
 *
 * useFormで自動的にデータを取得し、フォームを管理
 * URLから自動的にIDを取得するため、propsは不要
 */
export function EventEditForm() {
  const params = useParams();
  const eventId = params.id as string;
  const { isFileUploading, uploadIfNeeded } = useImageUpload();

  const {
    refineCore: { onFinish, query },
    handleSubmit,
    control,
    setError,
  } = useForm<EventEntity, HttpError, UpdateEventFormData>({
    resolver: zodResolver(updateEventFormSchema),
    refineCoreProps: {
      resource: "events",
      id: eventId,
      action: "edit",
      redirect: "show",
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
      openTime: DEFAULT_OPEN_TIME,
      startTime: DEFAULT_START_TIME,
      pricing: [],
      venue: undefined,
      performers: [],
      hashtags: [],
    },
  });

  const { data, isLoading, isError, refetch } = query ?? {};
  const defaultValues = data?.data;

  if (isLoading) return <EventLoading viewType="edit" />;
  if (isError) return <EventError viewType="edit" onRetry={refetch} />;
  if (!defaultValues) return <EventNotFound viewType="edit" />;

  const onSubmit = async (formData: UpdateEventFormData) => {
    try {
      const cleaned = cleanFormData(formData);
      const submitData = await uploadIfNeeded<UpdateEventFormData>(
        cleaned,
        setError,
      );
      if (!submitData) return; // アップロード失敗

      await onFinish(submitData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <EditView>
      <EditViewHeader />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>イベント基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <EventTitleField
                  control={control}
                  defaultValue={defaultValues.title}
                />
                <EventDateField
                  control={control}
                  defaultValue={defaultValues.date}
                />
                <EventTimeFields
                  control={control}
                  defaultOpenTime={defaultValues.openTime}
                  defaultStartTime={defaultValues.startTime}
                />
                <EventTypeField
                  control={control}
                  defaultValue={defaultValues.type}
                />
                <EventPublicationStatusField
                  control={control}
                  defaultValue={defaultValues.publicationStatus}
                />
                <EventIsPickupField
                  control={control}
                  defaultValue={defaultValues.isPickup}
                />
              </div>
              <div>
                <EventThumbnailField
                  control={control}
                  defaultValue={defaultValues.thumbnail}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>イベント詳細</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <EventDescriptionField
              control={control}
              defaultValue={defaultValues.description}
            />
            <EventPricingField control={control} />
            <EventVenueField
              control={control}
              defaultValue={defaultValues.venue}
            />
            <EventPerformersField control={control} />
            <EventHashtagsField
              control={control}
              defaultValue={defaultValues.hashtags}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isFileUploading}>
            {isFileUploading ? "画像をアップロード中..." : "更新"}
          </Button>
        </div>
      </form>
    </EditView>
  );
}

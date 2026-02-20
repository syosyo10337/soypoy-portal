"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useParams } from "next/navigation";
import {
  EventDateField,
  EventDescriptionField,
  EventIsPickupField,
  EventPublicationStatusField,
  EventThumbnailField,
  EventTimeField,
  EventTitleField,
  EventTypeField,
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
      time: "",
      type: undefined,
      thumbnail: undefined,
      isPickup: false,
    },
  });

  const { data, isLoading, isError, refetch } = query ?? {};
  const defaultValues = data?.data;

  if (isLoading) return <EventLoading viewType="edit" />;
  if (isError) return <EventError viewType="edit" onRetry={refetch} />;
  if (!defaultValues) return <EventNotFound viewType="edit" />;

  const onSubmit = async ({ time, ...formData }: UpdateEventFormData) => {
    try {
      const submitData = await uploadIfNeeded<
        Omit<UpdateEventFormData, "time">
      >(formData, setError);
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
    <EditView>
      <EditViewHeader />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>イベント情報</CardTitle>
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
                <EventTimeField
                  control={control}
                  defaultValue={
                    defaultValues.date.includes("T")
                      ? defaultValues.date.split("T")[1]?.substring(0, 5)
                      : undefined
                  }
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
                <EventDescriptionField
                  control={control}
                  defaultValue={defaultValues.description}
                />
              </div>
              <div>
                <EventThumbnailField
                  control={control}
                  defaultValue={defaultValues.thumbnail}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={isFileUploading}>
                {isFileUploading ? "画像をアップロード中..." : "更新"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </EditView>
  );
}

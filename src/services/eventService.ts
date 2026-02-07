import { nanoid } from "nanoid";
import { type EventEntity, PublicationStatus } from "@/domain/entities";
import type { EventRepository } from "@/domain/repositories/eventRepository";

/**
 * イベントサービス
 * ビジネスロジックを担当
 *
 * 注意: このサービス層は画像アップロードを行いません。
 * 画像は事前にクライアント→Server Action (uploadImageAction) でアップロードされ、
 * URLに変換された状態でこのサービスに渡されることを前提とします。
 * tRPCでFileをJSONシリアライズに失敗するため
 * TODO: transformer: superjson,をtRPCで設定することで解決するか試す。
 */
export class EventService {
  constructor(private repository: EventRepository) {}
  async getAllEvents(): Promise<EventEntity[]> {
    return await this.repository.list();
  }
  async getEventById(id: string): Promise<EventEntity | undefined> {
    return await this.repository.findById(id);
  }
  async createEvent(
    input: Omit<EventEntity, "id" | "publicationStatus">,
  ): Promise<EventEntity> {
    return await this.repository.create({
      id: nanoid(),
      publicationStatus: PublicationStatus.Draft,
      ...input,
    });
  }
  async updateEvent(
    id: string,
    input: Partial<Omit<EventEntity, "id">>,
  ): Promise<EventEntity> {
    return await this.repository.update(id, input);
  }
  async deleteEvent(id: string): Promise<EventEntity> {
    const event = await this.repository.findById(id);
    if (!event) {
      throw new Error("イベントが見つかりません");
    }
    return await this.repository.update(id, {
      publicationStatus: PublicationStatus.Archived,
    });
  }
  async getEventsByMonth(year: number, month: number): Promise<EventEntity[]> {
    return await this.repository.listByMonth(year, month);
  }

  /**
   * イベントを公開する
   */
  async publishEvent(id: string): Promise<EventEntity> {
    const event = await this.repository.findById(id);
    if (!event) {
      throw new Error("イベントが見つかりません");
    }
    return await this.repository.update(id, {
      publicationStatus: PublicationStatus.Published,
    });
  }

  /**
   * イベントを非公開（下書き）に戻す
   */
  async unpublishEvent(id: string): Promise<EventEntity> {
    const event = await this.repository.findById(id);
    if (!event) {
      throw new Error("イベントが見つかりません");
    }
    return await this.repository.update(id, {
      publicationStatus: PublicationStatus.Draft,
    });
  }
}

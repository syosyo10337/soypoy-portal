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
  async getPublishedEventById(id: string): Promise<EventEntity | undefined> {
    const event = await this.repository.findById(id);
    if (!event || event.publicationStatus !== PublicationStatus.Published) {
      return undefined;
    }
    return event;
  }
  async createEvent(input: Omit<EventEntity, "id">): Promise<EventEntity> {
    return await this.repository.create({
      id: nanoid(),
      ...input,
    });
  }
  async updateEvent(
    id: string,
    input: Partial<Omit<EventEntity, "id">>,
  ): Promise<EventEntity> {
    return await this.repository.update(id, input);
  }
  async deleteEvent(id: string): Promise<void> {
    return await this.repository.delete(id);
  }
  async getEventsByMonth(year: number, month: number): Promise<EventEntity[]> {
    return await this.repository.listByMonth(year, month);
  }
}

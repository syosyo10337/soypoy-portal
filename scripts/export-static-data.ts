import { writeFileSync } from "node:fs";
import path from "node:path";
import { desc } from "drizzle-orm";
import type { ClosedDayEntity } from "@/domain/entities/closedDay";
import { db } from "@/infrastructure/db";
import { DrizzleEventRepository } from "@/infrastructure/db/repositories/drizzleEventRepository";
import { closedDays as closedDaysTable } from "@/infrastructure/db/schema";

async function main() {
  const eventRepository = new DrizzleEventRepository();
  const allEvents = await eventRepository.list();

  const closedDayRows = await db
    .select()
    .from(closedDaysTable)
    .orderBy(desc(closedDaysTable.date));
  const allClosedDays: ClosedDayEntity[] = closedDayRows.map((row) => ({
    id: row.id,
    date: row.date,
  }));

  const eventsSource = `import type { EventEntity } from "@/domain/entities/event";

export const events: EventEntity[] = ${JSON.stringify(allEvents, null, 2)};
`;

  const closedDaysSource = `import type { ClosedDayEntity } from "@/domain/entities/closedDay";

export const closedDays: ClosedDayEntity[] = ${JSON.stringify(allClosedDays, null, 2)};
`;

  writeFileSync(path.join(process.cwd(), "src/data/events.ts"), eventsSource);
  writeFileSync(
    path.join(process.cwd(), "src/data/closedDays.ts"),
    closedDaysSource,
  );

  console.log(
    `Exported ${allEvents.length} events and ${allClosedDays.length} closed days to src/data/.`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

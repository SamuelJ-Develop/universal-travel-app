import Database from "@nozbe/watermelondb/Database";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import { databaseModelClasses } from "@/lib/db/models";
import { mockPlanningSnapshot } from "@/lib/db/mock";
import {
  loadPlanningSnapshotFromDatabase,
  seedDatabase,
} from "@/lib/db/preview";
import { databaseSchema } from "@/lib/db/schema";

let databaseInstance: Database | null = null;

function createDatabase() {
  const adapter = new SQLiteAdapter({
    dbName: "universal_travel_app",
    schema: databaseSchema,
  });

  return new Database({
    adapter,
    modelClasses: databaseModelClasses,
  });
}

export function getDatabase() {
  if (!databaseInstance) {
    databaseInstance = createDatabase();
  }

  return databaseInstance;
}

export async function getPlanningSnapshot() {
  try {
    const database = getDatabase();
    await seedDatabase(database);
    return await loadPlanningSnapshotFromDatabase(database);
  } catch {
    return mockPlanningSnapshot;
  }
}

import { Directory, File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

import type { PlanningSnapshot } from "@/lib/db";

export type Stage1JsonExport = {
  format: "universal-travel-app.stage-1";
  version: 1;
  exportedAt: string;
  sourceMode: PlanningSnapshot["mode"];
  trip: PlanningSnapshot["trip"];
  days: PlanningSnapshot["days"];
  restoreSupport: {
    importAvailable: false;
    notes: string;
  };
};

export type JsonExportResult =
  | {
      method: "download";
      fileName: string;
    }
  | {
      method: "share";
      fileName: string;
      uri: string;
    };

function sanitizeFilePart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function buildStage1JsonExport(
  snapshot: PlanningSnapshot,
): Stage1JsonExport {
  return {
    format: "universal-travel-app.stage-1",
    version: 1,
    exportedAt: new Date().toISOString(),
    sourceMode: snapshot.mode,
    trip: snapshot.trip,
    days: snapshot.days,
    restoreSupport: {
      importAvailable: false,
      notes:
        "Stage 1 supports JSON export only. Import or restore is not implemented yet.",
    },
  };
}

function downloadJsonOnWeb(fileName: string, contents: string): JsonExportResult {
  const blob = new Blob([contents], { type: "application/json" });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(objectUrl);

  return {
    method: "download",
    fileName,
  };
}

async function saveAndShareJsonOnDevice(
  fileName: string,
  contents: string,
): Promise<JsonExportResult> {
  const exportDirectory = new Directory(Paths.document, "exports");

  if (!exportDirectory.exists) {
    exportDirectory.create({ idempotent: true, intermediates: true });
  }

  const file = new File(exportDirectory, fileName);

  if (!file.exists) {
    file.create({ overwrite: true, intermediates: true });
  }

  file.write(contents);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      dialogTitle: "Share Universal Travel App backup",
      mimeType: "application/json",
      UTI: "public.json",
    });
  }

  return {
    method: "share",
    fileName,
    uri: file.uri,
  };
}

export async function exportPlanningSnapshotAsJson(
  snapshot: PlanningSnapshot,
): Promise<JsonExportResult> {
  const payload = buildStage1JsonExport(snapshot);
  const fileName = `${sanitizeFilePart(snapshot.trip.title)}-${snapshot.trip.startDate}.json`;
  const contents = JSON.stringify(payload, null, 2);

  if (Platform.OS === "web") {
    return downloadJsonOnWeb(fileName, contents);
  }

  return saveAndShareJsonOnDevice(fileName, contents);
}

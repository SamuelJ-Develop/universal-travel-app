import { useState } from "react";

import type { PlanningSnapshot } from "@/lib/db";
import {
  exportPlanningSnapshotAsJson,
  type JsonExportResult,
} from "@/lib/export/json-export";

type JsonExportState = {
  isExporting: boolean;
  lastResult: JsonExportResult | null;
  error: string | null;
};

export function useJsonExport() {
  const [state, setState] = useState<JsonExportState>({
    isExporting: false,
    lastResult: null,
    error: null,
  });

  async function exportSnapshot(snapshot: PlanningSnapshot) {
    setState((current) => ({
      ...current,
      isExporting: true,
      error: null,
    }));

    try {
      const result = await exportPlanningSnapshotAsJson(snapshot);

      setState({
        isExporting: false,
        lastResult: result,
        error: null,
      });
    } catch (error) {
      setState({
        isExporting: false,
        lastResult: null,
        error:
          error instanceof Error
            ? error.message
            : "JSON export failed unexpectedly.",
      });
    }
  }

  return {
    ...state,
    exportSnapshot,
  };
}

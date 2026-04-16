import { useEffect, useState } from "react";

import {
  getPlanningSnapshot,
  type PlanningSnapshot,
} from "@/lib/db";

type PlanningPreviewState = {
  isLoading: boolean;
  snapshot: PlanningSnapshot | null;
};

export function usePlanningPreview() {
  const [state, setState] = useState<PlanningPreviewState>({
    isLoading: true,
    snapshot: null,
  });

  useEffect(() => {
    let isMounted = true;

    getPlanningSnapshot().then((snapshot) => {
      if (!isMounted) {
        return;
      }

      setState({
        isLoading: false,
        snapshot,
      });
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}

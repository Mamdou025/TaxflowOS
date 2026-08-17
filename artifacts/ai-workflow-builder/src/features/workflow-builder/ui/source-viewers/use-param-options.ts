

// Live choices for a connector parameter, from GET /api/param-options.
//
// Replaced `useFxCurrencies`, which hardcoded the Bank of Canada endpoint and so
// only ever served one dropdown. This hook knows nothing about currencies: it
// asks for a connector's parameter and renders whatever that parameter declares
// it can be (see ApiParamOptionsSource). Any future connector with a published
// list works without touching this file.
//
// `options` is null while loading. An empty list means the lookup failed and the
// caller falls back to free-text entry rather than showing a menu it can't stand
// behind — a stale or invented list is worse than an honest text box.

import { useEffect, useState } from "react";
import type { ApiParamOption } from "@/shared/workflow-engine/execution/blocks/source/http-json/connectors";

// Module-level so every panel mount doesn't re-request the same list.
const cache = new Map<string, ApiParamOption[]>();

export function useParamOptions(connectorId?: string, paramKey?: string) {
  const key = connectorId && paramKey ? `${connectorId}:${paramKey}` : "";
  const [options, setOptions] = useState<ApiParamOption[] | null>(
    key ? (cache.get(key) ?? null) : []
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!key) {
      setOptions([]);
      return;
    }
    const cached = cache.get(key);
    if (cached) {
      setOptions(cached);
      return;
    }

    let active = true;
    setOptions(null);
    setFailed(false);
    void (async () => {
      try {
        const response = await fetch(
          `/api/param-options?connector=${encodeURIComponent(connectorId!)}&param=${encodeURIComponent(paramKey!)}`
        );
        const data = (await response.json()) as {
          ok?: boolean;
          options?: ApiParamOption[];
        };
        if (!active) {
          return;
        }
        if (data.ok && data.options?.length) {
          cache.set(key, data.options);
          setOptions(data.options);
        } else {
          setFailed(true);
          setOptions([]);
        }
      } catch {
        if (active) {
          setFailed(true);
          setOptions([]);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [key, connectorId, paramKey]);

  return { failed, options };
}

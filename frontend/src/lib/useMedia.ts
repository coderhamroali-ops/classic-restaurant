"use client";

import { useSyncExternalStore } from "react";

/** true, если совпадает медиазапрос. На сервере всегда false — без расхождения при гидратации. */
export function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => matchMedia(query).matches,
    () => false,
  );
}

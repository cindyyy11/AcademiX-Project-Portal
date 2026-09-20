import { useEffect, useRef } from "react";
import { onActivity } from "./activity";

// Call `fn` right away when the server pings us. `enabled` should be false in
// demo mode, where there is no server to listen to.
export const useActivity = (fn: () => void, enabled: boolean) => {
  const latest = useRef(fn);
  latest.current = fn;

  useEffect(() => {
    if (!enabled) return;
    return onActivity(() => latest.current());
  }, [enabled]);
};

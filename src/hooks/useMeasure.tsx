import React, { useState, useRef, useEffect } from "react";
import ResizeObserver from "resize-observer-polyfill";

export function useMeasure(): {
  ref: React.MutableRefObject<undefined>;
  left: number;
  top: number;
  width: number;
  height: number;
} {
  const ref = useRef();
  const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [ro] = useState(
    () => new ResizeObserver(([entry]) => set(entry.contentRect))
  );
  useEffect(() => {
    if (ref.current) ro.observe(ref.current as any);
    return () => ro.disconnect();
  }, [ro]);
  return { ...bounds, ref };
}

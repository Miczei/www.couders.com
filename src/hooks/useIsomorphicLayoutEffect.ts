import { useEffect, useLayoutEffect } from "react";

// useLayoutEffect warns during SSR; swap to useEffect on the server so GSAP
// setup runs synchronously in the browser without the React warning.
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

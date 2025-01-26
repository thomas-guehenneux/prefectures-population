"use client";

import { Provider as JotaiProvider } from "jotai";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Provider({ children }: Props) {
  return <JotaiProvider>{children}</JotaiProvider>;
}

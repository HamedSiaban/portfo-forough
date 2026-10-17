"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";

import { createQueryClient } from "@/lib/query-client";

function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(createQueryClient);

  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export { QueryProvider };

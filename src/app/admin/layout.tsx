"use client";

import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router/app";
import { Suspense } from "react";
import { Toaster } from "@/components/shadcn/sonner";
import { authProvider } from "./_providers/authProvider";
import { dataProvider } from "./_providers/dataProvider";
import { TRPCProvider } from "./_providers/trpcProvider";
import AdminLoading from "./loading";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <TRPCProvider>
        <Refine
          routerProvider={routerProvider}
          dataProvider={dataProvider}
          authProvider={authProvider}
          resources={[
            {
              name: "events",
              list: "/admin/events",
              create: "/admin/events/create",
              edit: "/admin/events/:id/edit",
              show: "/admin/events/:id",
              meta: {
                label: "イベント",
              },
            },
            {
              name: "closed-days",
              list: "/admin/closed-days",
              meta: {
                label: "休業日",
              },
            },
            {
              name: "admins",
              list: "/admin/admins",
              create: "/admin/admins/create",
              edit: "/admin/admins/:id/edit",
              show: "/admin/admins/:id",
              meta: {
                label: "管理者",
              },
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
            projectId: "soypoy-admin",
          }}
        >
          {children}
        </Refine>
        <Toaster richColors />
      </TRPCProvider>
    </Suspense>
  );
}

import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AuthGuard from "@/components/AuthGuard";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DefaultLayout>{children}</DefaultLayout>
    </AuthGuard>
  );
}

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import { NavHeader } from "@/components/nav-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marktopia",
  description: "Marktopia chatting system home page",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

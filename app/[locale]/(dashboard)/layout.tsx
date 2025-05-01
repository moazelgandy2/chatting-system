import { SideBar } from "./_components/side-bar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex gap-4 w-full h-full">
      <SideBar />
      <div>askdj</div>
    </div>
  );
}

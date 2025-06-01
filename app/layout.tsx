import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marktopia",
  description: "Marktopia chatting system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}

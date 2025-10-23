// app/layout.tsx
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "zigbee_test",
  description: "zigbee_test",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

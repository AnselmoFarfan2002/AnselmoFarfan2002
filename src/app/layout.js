"use client";

import NavBar from "@/components/navbar";
import ThemeRegistry from "./ThemeRegistry";
import "@/app/globals.css";
import { useSelectedLayoutSegment } from "next/navigation";

export default function RootLayout({ children, project }) {
  const projectSegment = useSelectedLayoutSegment("project");

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          margin: 0,
          paddingTop: "72px",
        }}
      >
        <ThemeRegistry options={{ key: "mui" }}>
          <NavBar />
          {project}
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}

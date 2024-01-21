import NavBar from "@/components/navbar";
import ThemeRegistry from "./ThemeRegistry";
import "@/app/globals.css";

export default function RootLayout({ children }) {
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
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}

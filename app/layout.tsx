import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Web Parser Tool",
  description:
    "Professional HTTP request & HTML source parser inspired by Postman, VS Code, and DevTools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="antialiased font-sans">
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#131822",
              border: "1px solid #242c3b",
              color: "#e6e9ef",
            },
          }}
        />
      </body>
    </html>
  );
}

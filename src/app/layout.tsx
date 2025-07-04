import "./globals.css";
import Navigation from "@/components/Navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}

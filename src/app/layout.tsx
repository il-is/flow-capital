import "./globals.css";
import Navigation from "@/components/Navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Navigation />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}

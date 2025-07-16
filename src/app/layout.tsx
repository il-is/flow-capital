import "./globals.css";
import Navigation from "@/components/Navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" type="image/png" href="/uploads/20250702_1736_Flow. Capital Logo_simple_compose_01jz5s1dttejqsh8w0435jgzra.png" />
      </head>
      <body>
        <Navigation />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}

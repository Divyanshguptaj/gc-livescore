import { Navbar } from "@/components/core/Navbar";
import "./globals.css";
export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html>
      <body>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}

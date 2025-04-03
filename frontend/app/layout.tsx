import { Navbar } from "@/components/core/Navbar";
import "./globals.css";
import LoadingSpinner from "@/components/common/LoadingSpinner";
export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html  className="h-[100%] w-[100%]">
      <body className="h-[100%] w-[100%]">
        <Navbar />
        <LoadingSpinner/>
        {children}
      </body>
    </html>
  );
}

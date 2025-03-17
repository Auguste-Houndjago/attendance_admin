import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Header from "../components/ux/Header";
import Footer from "../components/ux/Footer";
import { AuthProvider } from "../contexts/AuthContext";
import {HeroUIProvider} from "@heroui/react";
import ReactQueryProvider from "@/contexts/react-query-provider";
import { ThemeProvider } from "@/components/theme-provider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Attendance App",
  description: "Attendance App pour les professeurs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
      <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      >
        <Header/>
        <main className="min-h-screen flex flex-col ">
        <ReactQueryProvider>
      
          <AuthProvider>
          <HeroUIProvider>          
            {children}
          </HeroUIProvider>

          </AuthProvider>
          </ReactQueryProvider>
        </main>
        <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

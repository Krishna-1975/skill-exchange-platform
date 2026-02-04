import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Skill Exchange Platform",
  description: "Campus Skill Exchange",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <Header />
        {children}
        <Footer />   {/* 👈 ADD THIS LINE */}
      </body>
    </html>
  );
}


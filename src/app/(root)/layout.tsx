import HeaderServer from "@/components/HeaderServer";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderServer />
      {children}
      <Footer />
    </>
  );
}

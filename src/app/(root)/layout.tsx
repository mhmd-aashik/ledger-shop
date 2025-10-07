import HeaderServerSafe from "@/components/HeaderServerSafe";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderServerSafe />
      {children}
      <Footer />
    </>
  );
}

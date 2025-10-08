import HeaderServerSafe from "@/components/HeaderServerSafe";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Suspense } from "react";
import { PageLoading } from "@/components/Loading";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ErrorBoundary>
      <HeaderServerSafe />
      <Suspense fallback={<PageLoading />}>{children}</Suspense>
      <Footer />
    </ErrorBoundary>
  );
}

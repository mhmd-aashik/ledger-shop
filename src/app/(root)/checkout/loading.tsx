import Loading from "@/components/Loading";

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading type="page" message="Preparing checkout..." />
        </div>
      </main>
    </div>
  );
}

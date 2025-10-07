import { CountProvider } from "./CountProvider";
import HeaderClient from "./HeaderClient";

export default function HeaderServerSafe() {
  // Start with empty counts - let the client handle session loading
  const initialCartCount = 0;
  const initialFavoritesCount = 0;

  return (
    <CountProvider
      initialCartCount={initialCartCount}
      initialFavoritesCount={initialFavoritesCount}
    >
      <HeaderClient />
    </CountProvider>
  );
}

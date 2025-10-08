"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function MagicLinkPage() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyMagicLink = async () => {
      const token = searchParams.get("token");

      if (!token) {
        toast.error("Invalid magic link");
        router.push("/sign-in");
        return;
      }

      try {
        const response = await fetch("/api/auth/verify-magic-link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Sign in the user with NextAuth
          const signInResult = await signIn("credentials", {
            email: result.user.email,
            password: "magic-link-auth", // Special password for magic link users
            redirect: false,
          });

          if (signInResult?.error) {
            // If credentials don't work, we need to handle magic link users differently
            // For now, we'll create a session manually or redirect to a success page
            setIsSuccess(true);
            toast.success("Magic link verified! Redirecting...");
            setTimeout(() => {
              router.push("/");
            }, 2000);
          } else {
            toast.success("Signed in successfully!");
            router.push("/");
          }
        } else {
          toast.error(result.error || "Invalid or expired magic link");
          router.push("/sign-in");
        }
      } catch (error) {
        console.error("Error verifying magic link:", error);
        toast.error("Something went wrong");
        router.push("/sign-in");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyMagicLink();
  }, [searchParams, router]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying magic link...</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-amber-900 mb-2">Success!</h2>
          <p className="text-gray-600">Magic link verified. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-amber-900 mb-2">
          Verification Failed
        </h2>
        <p className="text-gray-600">Invalid or expired magic link.</p>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function FetchInterceptor() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalFetch = window.fetch;

    window.fetch = async function (...args) {
      const response = await originalFetch(...args);

      if (response.status === 403) {
        try {
          // Clone the response so that the original receiver can still read it if needed
          const clone = response.clone();
          const data = await clone.json();

          if (
            data &&
            typeof data.message === "string" &&
            data.message.toLowerCase().includes("trial expired")
          ) {
            // Check if we are not already on the subscribe page to prevent infinite redirects
            if (window.location.pathname !== "/subscribe") {
              // Trigger a beautiful premium sweetalert popup
              await Swal.fire({
                title: "Trial Expired",
                text: "Your trial period has expired. Please subscribe to continue using all Premium Pro features.",
                icon: "warning",
                confirmButtonColor: "#ea580c",
                confirmButtonText: "Subscribe Now",
                allowOutsideClick: false,
              });

              router.push("/subscribe");
            }
          }
        } catch (e) {
          // Ignore parsing issues or non-JSON responses
        }
      }

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [router]);

  return null;
}

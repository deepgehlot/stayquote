import { Suspense } from "react";
import Signup from "@/components/Signup";

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f9fa]">
          <div className="h-10 w-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <Signup />
    </Suspense>
  );
}

'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push('/login');
  }, [router]);
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <div className="size-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin">
      </div>
      <p className="text-gray-500 text-sm">กำลังโหลด . . .</p>
    </div>
  );
}

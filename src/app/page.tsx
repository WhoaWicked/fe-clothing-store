'use client'
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="h-screen flex items-center justify-center">
      <button
        className="tracking-wide cursor-pointer rounded-md border border-gray-300 py-2 px-4 bg-gray-50 text-gray-500 font-light hover:bg-gray-100 duration-300"
        onClick={() => router.push("/login")}>
        Start Project
      </button>
    </div>
  );
}

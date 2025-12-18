'use client';
import { Navbar } from "@/components/user/layout/Navbar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <div className="max-w-350 mx-auto">
                <Navbar />
                <main>{children}</main>
            </div>
        </div>
    )
}
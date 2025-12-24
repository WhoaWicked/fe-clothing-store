'use client';
import { Navbar } from "@/components/user/layout/Navbar";
import { CartProvider } from "@/context/user/cartContext";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <CartProvider>
                <div className="max-w-350 mx-auto">
                    <Navbar />
                    <main>{children}</main>
                </div>
            </CartProvider>
        </div>
    )
}
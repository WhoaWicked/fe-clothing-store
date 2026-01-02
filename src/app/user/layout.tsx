'use client';
import { Navbar } from "@/components/user/layout/Navbar";
import { Footer } from "@/components/user/layout/Footer";
import { CartProvider } from "@/context/user/cartContext";
import { ProfileProvider } from '@/context/profileContext';

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <ProfileProvider>
                <CartProvider>
                    <div className="max-w-350 mx-auto">
                        <Navbar />
                        <main>{children}</main>
                        <Footer />
                    </div>
                </CartProvider>
            </ProfileProvider>
        </div>
    )
}
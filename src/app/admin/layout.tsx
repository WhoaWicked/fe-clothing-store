'use client';
import React from 'react';
import { Navbar } from '@/components/admin/layout/Navbar';
import { Sidebar } from '@/components/admin/layout/Sidebar';
import { Footer } from '@/components/admin/layout/Footer';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Navbar />
            <div className='flex'>
                <Sidebar />
                <main className='flex-1'>
                    {children}
                    <Footer />
                </main>
            </div>
        </div>
    )
}
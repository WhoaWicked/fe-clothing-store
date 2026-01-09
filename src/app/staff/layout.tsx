'use client';
import React from 'react';
import { Navbar } from '@/components/staff/layout/Navbar';
import { Sidebar } from '@/components/staff/layout/Sidebar';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Navbar />
            <div className='flex'>
                <Sidebar />
                <main className='flex-1'>
                    {children}
                </main>
            </div>
        </div>
    )
}
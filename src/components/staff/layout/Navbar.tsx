'use client';
import React, { FC, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { RiShutDownLine } from 'react-icons/ri';
import { signOut } from 'next-auth/react';

export const Navbar: FC = () => {
    const router = useRouter();
    const handleLogout = async () => {
        try {
            const result = await Swal.fire({
                title: 'ยืนยันการออกจากระบบ',
                text: `คุณต้องการออกจากระบบหรือไม่?`,
                icon: 'warning',
                confirmButtonText: 'ออกจากระบบ',
                confirmButtonColor: '#d9534f',
                showCancelButton: true,
                cancelButtonColor: '#6B7280',
                cancelButtonText: 'ยกเลิก'
            });
            if (!result.isConfirmed) return;
            await signOut({ callbackUrl: '/login' });
        } catch (error: unknown) {
            console.log('Logout Error:', error);
        }
    }
    return (
        <nav id="staff-navbar"
            className=' py-4 border-b border-gray-300'>
            <div className='flex justify-between items-center max-w-350 mx-auto'>
                <div>
                    <h1 className='text-3xl tracking-wide italic uppercase font-medium text-gray-800'>Clothing</h1>
                </div>
                <div className='flex items-center gap-x-4 text-gray-700'>
                    <RiShutDownLine onClick={handleLogout} className='cursor-pointer transition-all duration-200 hover:scale-115' size={20} />
                </div>
            </div>
        </nav>
    )
}
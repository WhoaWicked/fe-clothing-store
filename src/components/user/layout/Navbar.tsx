'use client';
import React, { FC, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { PiUser } from 'react-icons/pi';
import { HiOutlineShoppingBag } from "react-icons/hi2";
import Swal from 'sweetalert2';

export const Navbar: FC = () => {
    const router = useRouter();
    const [userMenu, setUserMenu] = useState<boolean>(false);
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
                cancelButtonText: 'ยกเลิก',
                customClass: {
                    title: 'swal2-font-normal',
                    content: 'swal2-font-lighter',
                    confirmButton: 'swal2-font-lighter',
                    cancelButton: 'swal2-font-lighter',
                }
            });
            if (!result.isConfirmed) return;
            await axios.post('/api/auth/logout');
            router.push('/login');
        } catch (error: unknown) {
            console.log('Logout Error:', error);
        }
    }
    return (
        <nav id="user-navbar"
            className=' py-4 h-19 border-b border-gray-300'>
            <div className='flex justify-between items-center w-full'>
                <div>
                    <h1 className='text-3xl tracking-wide uppercase font-light text-gray-700'>Clothing .</h1>
                </div>
                <div>
                    <ul className='text-gray-800 uppercase tracking-wide font-light flex items-center gap-x-15'>
                        <li onClick={() => router.push('/user')} className='cursor-pointer'>หน้าหลัก</li>
                        <li onClick={() => router.push('/user/product')} className='cursor-pointer'>สินค้า</li>
                        <li className='cursor-pointer'>เกี่ยวกับ</li>
                        <li className='cursor-pointer'>ติดต่อ</li>
                    </ul>
                </div>
                <div>
                    <div className='flex items-center gap-x-4 text-gray-600'>
                        <HiOutlineShoppingBag className='cursor-pointer' size={23} />
                        <div className='relative'
                            onMouseEnter={() => setUserMenu(true)}
                            onMouseLeave={() => setUserMenu(false)}
                        >
                            <PiUser className='cursor-pointer' size={23} />
                            {userMenu && (
                                <div className='z-20 absolute right-0 top-6 bg-white pt-2'>
                                    <div className='border border-gray-300  w-40  shadow-sm'>
                                        <ul className='font-light text-gray-900 text-sm tracking-wide'>
                                            <li className='hover:bg-gray-200 p-3 cursor-pointer'>โปรไฟล์ผู้ใช้</li>
                                            <li className='hover:bg-gray-200 p-3 cursor-pointer'>รายการสั่งซื้อ</li>
                                            <li className='hover:bg-gray-200 p-3 cursor-pointer'>ที่อยู่จัดส่ง</li>
                                            <li className='hover:bg-gray-200 p-3 cursor-pointer' onClick={handleLogout}>ออกจากระบบ</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
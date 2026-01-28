'use client';
import React, { FC, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoIosAddCircleOutline } from "react-icons/io";
import { BsBoxSeam } from "react-icons/bs";
import { PiNewspaper, PiUser } from "react-icons/pi";
import { IoIosList } from "react-icons/io";
import { GoHome } from "react-icons/go";


export const Sidebar: FC = () => {
    const pathname = usePathname();
    const sidebarMenu = [
        // { name: 'Add Product', icon: <IoIosAddCircleOutline size={22} />, href: '/staff/product/add' },
        { name: 'Activity Logs', icon: <PiNewspaper size={22} />, href: '/admin/log' },
        { name: 'Users', icon: <PiUser size={19} />, href: '/admin/manage-user' },
    ]

    return (
        <aside id='staff-sidebar-component'>
            <div className='min-h-screen w-70 py-6 border-r border-gray-300 '>
                <div className='flex flex-col items-end gap-y-4 tracking-wide font-light text-sm text-gray-600'>
                    {sidebarMenu.map((menu, index) => (
                        <Link
                            className={`${pathname == menu.href ? 'border-gray-800 text-gray-900 font-normal' : 'border-gray-300'} flex items-center gap-x-3 border border-r-transparent w-55 p-3`} key={index} href={menu.href}>
                            <span>{menu.icon}</span>
                            <span>{menu.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    )
}
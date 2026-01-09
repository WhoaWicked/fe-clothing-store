'use client';
import React, { FC, useState } from 'react';
import { PiCopyright } from "react-icons/pi";

export const Footer: FC = () => {
    const year = new Date().getFullYear();
    return (
        <footer id='footer-component' className='mt-30 h-17 py-4 border-t border-gray-300'>
            <div className='flex justify-center items-center h-full'>
                <div className='tracking-wide flex justify-center items-center gap-x-2'>
                    <PiCopyright size={20} className='text-gray-700' />
                    <p className='text-sm text-gray-800 font-light'>{year} FE Clothing. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
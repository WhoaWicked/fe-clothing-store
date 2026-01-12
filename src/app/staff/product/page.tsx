'use client';
import React, { useEffect, useState } from 'react';
import { ProductList } from '@/components/staff/Product';

export default function Page() {
    const menuOptions = [
        { label: 'สินค้า', value: 'product' },
        { label: 'หมวดหมู่', value: 'category' }
    ];
    const [selectedStatus, setSelectedStatus] = useState<string>('product');

    return (
        <div id='staff-product-page' className='p-6'>
            <div className='mb-10'>
                <div className="flex items-center gap-x-3 mb-2">
                    <h1 className="text-gray-800 text-3xl font-light">จัดการสินค้าและหมวดหมู่</h1>
                    <div className="mt-1 w-12 h-0.75 bg-gray-600"></div>
                </div>
                <p className='font-light text-gray-500'>ดูแลจัดการรายการสินค้าในระบบของคุณได้ที่นี่</p>
            </div>
            {/* <div>
                <div className='tracking-wide flex items-center gap-x-10 border-b border-gray-300'>
                    {
                        menuOptions.map((option) => (
                            <button key={option.value}
                                onClick={() => setSelectedStatus(option.value)}
                                className={`${selectedStatus === option.value ? 'text-black border-gray-700' : 'border-transparent text-gray-500'} pb-5 border-b-3 font-light cursor-pointer transition-all duration-300 ease-out`}>
                                {option.label}
                            </button>
                        ))
                    }
                </div>
            </div> */}
            <div className='mt-6'>
                <ProductList />
            </div>
        </div>
    )
}
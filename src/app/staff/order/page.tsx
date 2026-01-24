'use client';
import React, { useEffect, useState } from 'react';
import { OrderList } from '@/components/staff/Order';

export default function Page() {
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const statusOptions = [
        { label: 'ทั้งหมด', value: '' },
        { label: 'รอชำระเงิน', value: 'pending_payment' },
        { label: 'รอจัดส่ง', value: 'processing' },
        { label: 'กำลังจัดส่ง', value: 'shipped' },
        { label: 'สำเร็จ', value: 'delivered' },
        { label: 'ยกเลิก', value: 'cancelled' },
    ];
    return (
        <div id='staff-order-page' className='p-6'>
            <div className='mb-10'>
                <div className="flex items-center gap-x-3 mb-2">
                    <h1 className="text-gray-800 text-3xl font-light">จัดการคำสั่งซื้อ</h1>
                    <div className="mt-1 w-12 h-0.75 bg-gray-600"></div>
                </div>
                <p className='font-light text-gray-500'>ดูแลจัดการรายการสินค้าในระบบของคุณได้ที่นี่</p>
            </div>
            <div>
                <div className='tracking-wide flex items-center gap-x-10 border-b border-gray-300'>
                    {
                        statusOptions.map((status) => (
                            <button key={status.value}
                                onClick={() => setSelectedStatus(status.value)}
                                className={`${selectedStatus === status.value ? 'text-black border-gray-700' : 'border-transparent text-gray-500'} pb-5 border-b-3 font-light cursor-pointer transition-all duration-300 ease-out`}>
                                {status.label}
                            </button>
                        ))
                    }
                </div>
            </div>
            <div className='mt-6'>
                <OrderList statusName={selectedStatus} />
            </div>
        </div>
    )
}
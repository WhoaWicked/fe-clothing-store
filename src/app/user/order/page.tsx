'use client';
import React, { useState, useEffect } from 'react';
import { OrderList } from '@/components/user/Order';
import { AiFillInfoCircle } from 'react-icons/ai';

export default function Page() {
  const statusOptions = [
    { label: 'ทั้งหมด', value: null },
    { label: 'รอชำระเงิน', value: 1 },
    { label: 'รอจัดส่ง', value: 2 },
    { label: 'กำลังจัดส่ง', value: 3 },
    { label: 'สำเร็จ', value: 4 },
    { label: 'ยกเลิก', value: 5 },
  ];
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  return (
    <div id="user-order-page" className='mt-20'>
      <div>
        <div className='mb-10'>
          <div className="flex items-center gap-x-3 mb-2">
            <h1 className="text-gray-800 text-3xl font-light">ประวัติการสั่งซื้อ</h1>
            <div className="mt-1 w-12 h-0.75 bg-gray-600"></div>
          </div>
          <p className='font-light text-gray-500'>ติดตามสถานะ และดูรายละเอียดการสั่งซื้อของคุณได้ที่นี่</p>
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
          <div className='flex justify-end'>
            <div className='flex items-center gap-x-2 mt-5'>
              <AiFillInfoCircle size={20} className='text-gray-300' />
              <p className='text-sm text-gray-400 font-light'>
                กรุณาชำระเงินภายใน 30 นาที ระบบจะยกเลิกออเดอร์หากไม่ได้ชำระเงิน
              </p>
            </div>
          </div>
        </div>
      </div>
      <OrderList statusId={selectedStatus} />
    </div>
  )
}

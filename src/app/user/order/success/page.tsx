'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { IoCheckmarkDone } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (sessionId) {
      setIsValid(true);
    }
  }, [sessionId]);

  if (!isValid && !sessionId) {
    return (
      <div className='min-h-screen -mt-16 flex items-center justify-center'>
        <div>
          <div>
            <AiOutlineLoading3Quarters size={50} className="text-gray-300 animate-spin mx-auto mb-6" />
          </div>
          <div className='flex flex-col items-center space-y-2'>
            <h2 className="text-3xl font-normal text-gray-800">กำลังยืนยันการชำระเงิน</h2>
            <p className="text-gray-600 font-light text-sm"></p>
            <p className='text-gray-600 font-light text-sm'>หากใช้เวลานานเกินไป กรุณาลองรีเฟรชหน้าหรือกลับไปยังหน้าหลัก</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-15 flex items-center justify-center">
      <div className="max-w-md w-full border border-gray-300 shadow-lg px-8 py-12">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-200 mb-6 transition-all ease-out duration-300 animate-bounce">
          <IoCheckmarkDone size={50} className=" text-green-600" />
        </div>
        <div className='tracking-wide'>
          <div className='text-center'>
            <h2 className="text-3xl font-normal text-gray-800 mb-4">ชำระเงินเรียบร้อย!</h2>
            <p className="text-gray-600 font-light text-sm mb-8">
              ขอบคุณสำหรับการสั่งซื้อ เราได้รับยอดเงินของคุณแล้ว<br />
              และกำลังเตรียมจัดส่งสินค้าให้คุณโดยเร็วที่สุด
            </p>
          </div>
          <div className="bg-gray-100 font-light p-3 rounded text-sm text-gray-500 break-all mb-8">
            REF : {sessionId}
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <Link
            href="/user/order"
            className="w-full px-4 py-3 text-center font-light tracking-wide text-sm transition-all duration-200 bg-black text-white hover:opacity-80"
          >
            ดูประวัติการสั่งซื้อ
          </Link>
          <Link
            href="/user"
            className="w-full px-4 py-3 text-center font-light tracking-wide text-sm transition-all duration-200 border border-gray-300 shadow-md hover:border-gray-500"
          >
            กลับสู่หน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
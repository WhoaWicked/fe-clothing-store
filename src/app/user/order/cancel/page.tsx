'use client';

import Link from 'next/link';
import { RxCross2 } from 'react-icons/rx';

export default function OrderCancelPage() {
  return (
    <div className="mt-25 flex items-center justify-center">
      <div className="max-w-md w-full border border-gray-300 shadow-lg px-8 py-12">

        {/* ไอคอนติ๊กถูกสีเขียว */}
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-200 mb-6 transition-all ease-out duration-300 animate-bounce">
          <RxCross2 size={50} className=" text-red-600" />
        </div>

        <div className='tracking-wide'>
          <div className='text-center'>
            <h2 className="text-3xl font-normal text-gray-800 mb-4">การชำระเงินถูกยกเลิก</h2>
            <p className="text-gray-600 font-light text-sm mb-8">
              การชำระเงินของคุณถูกยกเลิกหรือไม่สำเร็จ<br />
              กรุณาลองใหม่อีกครั้งหรือติดต่อฝ่ายบริการลูกค้า
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <Link
            href="/user/checkout"
            className="w-full px-4 py-3 text-center font-light tracking-wide text-sm transition-all duration-200 bg-black text-white hover:opacity-80"
          >
            ชำระเงินใหม่
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
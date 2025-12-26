// ProductSkeleton.tsx (หรือแปะไว้ในไฟล์ Products.tsx)
import { FC } from 'react';
import { FaLayerGroup } from 'react-icons/fa';

export const ProductSkeleton: FC = () => {
    return (
        // 1. กรอบนอก (เลียนแบบ Card จริง)
        <div className="flex flex-col border border-gray-200 shadow-sm">

            {/* 2. ส่วนรูปภาพ (สี่เหลี่ยมจัตุรัส aspect-square) */}
            <div className="aspect-square w-full bg-gray-200 animate-pulse"></div>

            {/* 3. ส่วนเนื้อหา (Title, Desc, Price) */}
            <div className="p-4 space-y-4">

                {/* ชื่อสินค้า (เลียนแบบตัวหนังสือ) */}
                <div className="h-5 bg-gray-200 animate-pulse rounded w-3/4"></div>

                {/* คำอธิบาย (ยาวหน่อย) */}
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>

                {/* ราคา (สั้นๆ หนาๆ) */}
                <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4 pt-2"></div>

            </div>
        </div>
    );
};

export const GenderSkeleton: FC = () => {
    return (
        <div className="border border-gray-200 p-5 bg-white shadow-sm">
            {/* ส่วนหัวข้อ (Title) เช่นคำว่า 'Gender' หรือ 'เพศ' */}
            <div className="w-16 h-5 bg-gray-200 animate-pulse rounded mb-5"></div>

            {/* ส่วนตัวเลือก */}
            <div className="space-y-4">
                {/* วนลูปสร้าง Checkbox + Text */}
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center gap-3">
                        {/* 1. กล่องสี่เหลี่ยมแทน Checkbox */}
                        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse "></div>

                        {/* 2. เส้นยาวๆ แทนข้อความ (สุ่มความยาวเพื่อให้ดูธรรมชาติ) */}
                        <div
                            className={`h-4 bg-gray-200 rounded animate-pulse ${index === 1 ? 'w-24' : 'w-16' // สลับยาวสั้น
                                }`}
                        ></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export const CategorySkeleton: FC = () => {
    return (
        <div className="border border-gray-300 p-5 shadow-sm bg-white">
            <div className="w-16 h-5 bg-gray-200 animate-pulse rounded mb-5"></div>
            <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="size-5 bg-gray-200 rounded animate-pulses"></div>
                        <div
                            className={`h-4 bg-gray-200 rounded animate-pulse ${index % 2 === 0 ? 'w-24' : 'w-16'}`}
                        ></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export const OneProductSkeleton: FC = () => {
    return (
        <div className='my-10'>
            <div className='grid grid-cols-2 gap-x-10'>
                <div className='h-130 flex gap-4'>
                    <div className=' flex flex-col gap-4 w-30 shrink-0'>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className='relative aspect-4/4 h-full w-full overflow-hidden'>
                                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                    <div className='relative flex-1 overflow-hidden'>
                        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                    </div>
                </div>
                <div>
                    <div className='space-y-4 border-b border-gray-200 pb-6 mb-6'>
                        <div className='h-5 bg-gray-200 rounded animate-pulse w-2/4'></div>
                        <div className='h-3 bg-gray-200 rounded animate-pulse w-1/4'></div>
                        <div className='h-6 bg-gray-200 rounded animate-pulse w-1/4'></div>
                    </div>
                    <div className='space-y-4 border-b border-gray-200 pb-6 mb-6'>
                        <div className='h-4 bg-gray-200 rounded animate-pulse w-4/4'></div>
                        <div className='h-4 bg-gray-200 rounded animate-pulse w-4/4'></div>
                        <div className='h-4 bg-gray-200 rounded animate-pulse w-3/4'></div>
                    </div>
                    <div className='mb-8'>
                        <div className='h-5 bg-gray-200 rounded animate-pulse w-1/4 mb-4'></div>
                        <div className='flex items-center gap-x-5'>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div key={index} className='size-12 bg-gray-200 animate-pulse'></div>
                            ))}
                        </div>
                    </div>
                    <div className='h-13 bg-gray-200 rounded animate-pulse w-1/3'></div>
                </div>
            </div>
        </div>
    )
}

export const ProductNoImage: FC<{ image?: string }> = ({ image = 'large_image' }) => {
    if (image === 'small_image') {
        return (
            <div className='size-full bg-gray-100 flex justify-center items-center flex-col gap-y-6'>
                <FaLayerGroup size={30} className=' text-gray-300 ' />
            </div>
        )
    }
    return (
        <div className='size-full bg-gray-100 flex justify-center items-center flex-col gap-y-6'>
            <FaLayerGroup size={60} className=' text-gray-300 ' />
            <p className='text-xs text-gray-500 font-light tracking-wide'>ไม่มีรูปภาพสินค้า</p>
        </div>
    )
}
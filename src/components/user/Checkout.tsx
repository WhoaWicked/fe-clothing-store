'use client';
import React from 'react'
import { useState, useEffect } from 'react';
import { useCart } from '@/context/user/cartContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { ProductNoImage } from './ProductSkeleton';
import { SlArrowLeft } from 'react-icons/sl';

const showErrorAlert = (message: string) => {
    Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถสั่งซื้อสินค้าได้',
        text: message,
        confirmButtonText: 'ตกลง'
    });
}

export function Checkout() {
    const router = useRouter();
    const { cartData } = useCart();
    const { items } = cartData || {};
    console.log(items)
    const [address, setAddress] = useState({
        first_name: "",
        last_name: "",
        street: "",
        sub_district: "",
        district: "",
        province: "",
        zip_code: "",
        phone: ""
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddress({
            ...address,
            [name]: value
        });
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/user/order/place-order', {
                shippingAddress: address
            });

            if (response.status === 200 && response.data) {
                window.location.href = response.data.checkoutUrl;
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                showErrorAlert(error.response.data.error.message || 'เกิดข้อผิดพลาดในการส่งที่อยู่จัดส่ง');
                console.error("Error submitting address:", error.response.data);
                return;
            }
            console.error("Error submitting address:", error);
        }
    }
    return (
        <div id="user-checkout-component" className='my-20 max-w-250 mx-auto'>
            <div className='flex justify-center gap-x-15'>
                <div>
                    <button onClick={() => router.push('/user/cart')} className='flex items-center gap-x-3 font-light bg-white text-sm cursor-pointer text-gray-700 border border-gray-300 shadow-sm hover:border-gray-500 hover:text-gray-900 px-4 py-3 disabled:opacity-50 disabled:cursor-default hover:scale-105 transition-all duaration-300 mb-6'>
                        <SlArrowLeft />
                        <span>
                            ย้อนกลับ
                        </span>
                    </button>
                    <div className="flex items-center gap-x-3 mb-10">
                        <h1 className="text-gray-800 text-3xl font-light">ที่อยู่จัดส่ง</h1>
                        <div className="mt-1 w-12 h-0.75 bg-gray-600"></div>
                    </div>
                    <div>
                        <form action="" onSubmit={handleSubmit} className='w-125 space-y-6'>
                            <div className='flex gap-x-4'>
                                <input name='first_name' value={address.first_name} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='ชื่อจริง' autoFocus />
                                <input name='last_name' value={address.last_name} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='นามสกุล' />
                            </div>
                            <div>
                                <input name='street' value={address.street} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type='text' placeholder='ที่อยู่ / ถนน / บ้านเลขที่' />
                            </div>
                            <div className='flex gap-x-4'>
                                <input name='sub_district' value={address.sub_district} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='ตำบาล / แขวง' />
                                <input name='district' value={address.district} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='อำเภอ / เขต' />
                            </div>
                            <div className='flex gap-x-4'>
                                <input name='province' value={address.province} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='จังหวัด' />
                                <input name='zip_code' value={address.zip_code} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='รหัสไปรษณีย์' />
                            </div>
                            <div className='flex gap-x-4'>
                                <input name='phone' value={address.phone} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='เบอร์โทรศัพท์' />
                            </div>
                            <div
                                className=''>
                                <button
                                    type='submit'
                                    className={`${cartData?.items.length === 0 ? 'opacity-40 cursor-default' : 'hover:opacity-70'} bg-black w-full cursor-pointer  text-white font-light text-md py-2.5 transition-all duration-100 `}>สั่งซื้อสินค้า</button>
                            </div>
                        </form>
                    </div></div>
                <div>
                    <div className='p-4.5 w-120 h-fit tracking-wide '>
                        <div className='mb-4 border-b border-gray-300 pb-4'>
                            <h2 className='text-xl mb-5'>รายการสินค้า</h2>
                            <div className='pt-4 pr-4 h-90 overflow-y-scroll'>
                                {items?.map((item: any) => (
                                    <div key={item.item_id}>
                                        <div className='flex justify-between items-start space-y-5'>
                                            <div className='flex gap-x-5'>
                                                {item.image_path ? (
                                                    <div onClick={() => router.push(`/user/product/${item?.product_id}-${item.product_code}-${item.product_name}`)} className='cursor-pointer size-25 aspect-square relative shadow-md  '>
                                                        <Image
                                                            className='absolute'
                                                            fill
                                                            src={item?.image_path || 'Product Image'}
                                                            alt={item?.product_name || 'Product Image'}
                                                        />
                                                        <div className='flex justify-center items-center size-6 bg-black absolute -top-2 -right-2 rounded-full'>
                                                            <span className='text-white text-[10px]'>{item?.quantity > 99 ? '99+' : item?.quantity}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div onClick={() => router.push(`/user/product/${item?.product_id}-${item.product_code}-${item.product_name}`)} className='cursor-pointer border border-gray-300 size-25 aspect-square relative'>
                                                        <ProductNoImage image='small_image' />
                                                        <div className='flex justify-center items-center size-6 bg-black absolute -top-2 -right-2 rounded-full'>
                                                            <span className='text-white text-[10px]'>{item?.quantity > 99 ? '99+' : item?.quantity}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className='text-gray-900 font-light text-md mb-2'>{item.product_name}</p>
                                                    <p className='text-sm text-gray-500 font-light'>ไซส์ {item.size}</p>
                                                </div>
                                            </div>
                                            <p className='text-gray-900 font-medium'>฿ {Number(item?.total_item_price).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <h2 className='text-xl mb-6.5'>สรุปคำสั่งซื้อ</h2>
                        <div className='text-gray-900 font-light text-md space-y-5'>
                            <div className='flex justify-between items-center '>
                                <p>ยอดรวมย่อย</p>
                                <p>฿ {Number(cartData?.summary?.total_cart_price).toLocaleString()}</p>
                            </div>
                            <div className='flex justify-between items-center border-b border-gray-300 pb-5 mb-5'>
                                <p>ค่าธรรมเนียมการจัดส่ง</p>
                                <p>ฟรี</p>
                            </div>
                        </div>
                        <div>
                            <div className='flex justify-between items-center text-gray-900 font-medium border-b border-gray-300 mb-5 pb-5'>
                                <p>ยอดรวม</p>
                                <p>฿ {Number(cartData?.summary?.total_cart_price).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className='mb-6'>
                            <h2 className='text-xl mb-5'>การชำระเงิน</h2>
                            <div className='grid grid-cols-2 gap-x-4'>
                                <div className='w-full cursor-pointer flex items-center justify-between gap-x-6 py-2 px-4 border-2 border-gray-300 '>
                                    <div className='size-3 bg-gray-300 rounded-full'>
                                    </div>
                                    <div>
                                        <p className='font-light text-gray-400'>เก็บเงินปลายทาง</p>
                                    </div>
                                    <div></div>
                                </div>
                                <div className='w-full cursor-pointer flex items-center justify-between gap-x-6 py-2 px-4 bg-[#635BFF] shadow-md'>
                                    <div className='size-3 bg-green-400 rounded-full'>
                                    </div>
                                    <div>
                                        <p className='font-medium text-white tracking-widest text-lg'>STRIPE</p>
                                    </div>
                                    <div></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
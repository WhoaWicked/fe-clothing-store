'use client';
import React from 'react'
import { useState, useEffect, FC } from 'react';
import { useCart } from '@/context/user/cartContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { ProductNoImage } from './ProductSkeleton';
import { SlArrowLeft } from 'react-icons/sl';
import { AiFillInfoCircle } from "react-icons/ai";
import useSWR from 'swr';
import { HiOutlineHome } from 'react-icons/hi2';
import { RxCross2 } from 'react-icons/rx';

const showErrorAlert = (message: string) => {
    Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถสั่งซื้อสินค้าได้',
        text: message,
        confirmButtonText: 'ตกลง'
    });
}

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export function Checkout() {
    const router = useRouter();
    const { cartData } = useCart();
    const { items } = cartData || {};
    const [openAddressPopup, setOpenAddressPopup] = useState(false);
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
    const handleSelect = (selectedAddress: any) => {
        setAddress({
            first_name: selectedAddress.first_name,
            last_name: selectedAddress.last_name,
            street: selectedAddress.street,
            sub_district: selectedAddress.sub_district,
            district: selectedAddress.district,
            province: selectedAddress.province,
            zip_code: selectedAddress.zip_code,
            phone: selectedAddress.phone
        });
        setOpenAddressPopup(false);
    }
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
                    <button onClick={() => router.push('/user/cart')} className='flex items-center gap-x-3 font-light bg-white text-sm cursor-pointer text-gray-700 border border-gray-300 shadow-sm hover:border-gray-500 hover:text-gray-900 px-4 py-2 disabled:opacity-50 disabled:cursor-default hover:scale-105 transition-all duaration-300 mb-8'>
                        <SlArrowLeft size={13} />
                        <span>
                            ย้อนกลับ
                        </span>
                    </button>
                    <div className='flex justify-between items-center mb-10'>
                        <div className="flex items-center gap-x-3">
                            <h1 className="text-gray-800 text-3xl font-light">ที่อยู่จัดส่ง</h1>
                            <div className="mt-1 w-12 h-0.75 bg-gray-600"></div>
                        </div>
                        <div onClick={() => setOpenAddressPopup(true)} className='flex items-center gap-x-2 cursor-pointer transition-all duration-300 hover:scale-110'>
                            <HiOutlineHome size={20} className='text-gray-600 cursor-pointer' />
                            <button className='cursor-pointer font-light text-gray-700 text-sm'>เลือกที่อยู่จัดส่ง</button>
                        </div>
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
                    </div>
                </div>
                <div>
                    <div className='p-4.5 w-120 h-fit tracking-wide '>
                        <div className='mb-4 border-b border-gray-300 pb-4'>
                            <h2 className='text-xl mb-5'>รายการสินค้า</h2>
                            <div className='pt-4 pr-4 max-h-90 overflow-y-scroll'>
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
                            <div className='flex items-center gap-x-2 mt-5'>
                                <AiFillInfoCircle size={20} className='text-gray-300' />
                                <p className='text-sm text-gray-400 font-light'>
                                    กรุณาชำระเงินภายใน 30 นาที ระบบจะยกเลิกออเดอร์หากไม่ได้ชำระเงิน
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {openAddressPopup && <AddressListPopup onSelectAddress={handleSelect} onClose={() => setOpenAddressPopup(false)} />}
        </div>
    )
}

interface AddressListPopupProps {
    onClose: () => void;
    onSelectAddress?: (address: any) => void;
}

const AddressListPopup: FC<AddressListPopupProps> = ({ onClose, onSelectAddress }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const { data, error, isLoading } = useSWR('/api/user/address', fetcher,
        { onError: (err) => console.error("Error fetching addresses:", err) }
    );
    return (
        <div id="user-address-list-popup-component">
            <div className="px-4 md:px-0 fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-75 max-w-150 w-full bg-white rounded-[5px] py-4 pb-6 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-6'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className=' font-normal text-gray-800'>ที่อยู่ทั้งหมดของฉัน</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-6 pr-2 font-light '>
                        <div className='space-y-5 h-95.5 overflow-y-auto pr-4'>
                            {data?.map((address: any) => (
                                <div onClick={() => onSelectAddress && onSelectAddress(address)} key={address.id} className='cursor-pointer border border-gray-300 p-4 shadow-sm rounded transition-all duration-100 hover:bg-gray-100 hover:border-gray-400'>
                                    <div>
                                        <div className='text-gray-900 font-light text-md mb-3 flex items-center justify-between gap-x-4'>
                                            <span className='line-clamp-1'>{address.first_name} {address.last_name} </span>
                                        </div>
                                        <p className='text-sm text-gray-500 font-light mb-1'>(+66) {address.phone}</p>
                                        <p className='text-sm text-gray-500 font-light line-clamp-1'>{address.street}, {address.sub_district}, {address.district}, {address.province}, {address.zip_code}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
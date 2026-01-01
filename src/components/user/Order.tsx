'use client';
import React, { useState, useEffect, FC } from 'react';
import useSWR, { mutate } from 'swr';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { BsBoxSeam } from "react-icons/bs";
import { DateTime } from "luxon";
import { GoCalendar } from "react-icons/go";
import { SlArrowDown } from 'react-icons/sl';
import Image from 'next/image';
import { ProductNoImage } from './ProductSkeleton';
import { PiNewspaperLight } from "react-icons/pi";
import Swal from 'sweetalert2';
import { RxCross2 } from 'react-icons/rx';
import { OrderListSkeleton } from './OrderSkeleton';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

interface OrderListProps {
    statusId: number | null;
}

interface CancelOrderPopupProps {
    mutate: () => void;
    order: any;
    onClose: () => void;
}

const formatThaiDate = (dateString: string) => {
    return DateTime.fromISO(dateString, { zone: 'utc' })
        .setZone('Asia/Bangkok')
        .setLocale('th')
        .toFormat('d LLLL yyyy HH:mm');
};

export const OrderList: FC<OrderListProps> = ({ statusId }) => {
    const router = useRouter();
    const { data, error, isLoading, mutate } = useSWR(`/api/user/order?order_status_id=${statusId}`, fetcher, {
        onError: (err) => {
            console.error("Error fetching orders:", err);
        }
    });
    const [orderDetails, setOrderDetails] = useState<number | null>(null);
    const [selectCancelOrderId, setSelectCancelOrderId] = useState<number | null>(null);
    const toggleOrderDetails = (orderId: number) => {
        setOrderDetails(prev => (prev === orderId ? null : orderId));
    }
    useEffect(() => {
        setOrderDetails(null);
    }, [statusId]);

    if (isLoading) {
        return (
            <OrderListSkeleton loop={5} />
        )
    }

    if (data?.orders?.length === 0) {
        return (
            <div className='mt-20 h-full flex flex-col items-center  justify-center tracking-wide '>
                <div className='mb-10'>
                    <PiNewspaperLight className="text-gray-400" size={40} />
                </div>
                <div className='flex items-center flex-col justify-center space-y-2 mb-6'>
                    <h3 className='text-lg font-normal text-gray-800'>ยังไม่มีรายการสั่งซื้อ</h3>
                    <p className='text-sm font-light text-gray-600'>คุณยังไม่มีประวัติการสั่งซื้อสินค้ากับเรา</p>
                </div>
                <button onClick={() => router.push('/user/product')} className='font-light bg-white text-sm cursor-pointer text-gray-700 border border-gray-300 shadow-sm hover:border-gray-500 hover:text-gray-900 px-5 py-3 disabled:opacity-50 disabled:cursor-default hover:scale-105 transition-all duaration-300'>กลับไปเลือกซื้อสินค้า</button>
            </div>
        )
    }
    const handleRepayOrder = async (order: any) => {
        try {
            const orderId = order.id;
            const response = await axios.post(`/api/user/order/repay/${orderId}`);
            if (response.status === 200 && response.data) {
                window.location.assign(response.data.checkoutUrl);
            }

        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error("Error repaying order:", error.response.data.error.message || error.response.data);
                return;
            }
            console.error("Error repaying order:", error);
        }
    }
    const statusButtonConfig = [
        {
            status: 'pending_payment',
            buttons: [
                {
                    label: 'ยกเลิกคำสั่งซื้อ',
                    className: 'cursor-pointer font-light text-gray-800 px-5.5 py-2 text-sm rounded border border-gray-300 transition-all duration-100 hover:border-gray-300 hover:bg-gray-100',
                    onClick: (order: any) => { setSelectCancelOrderId(order) }, // ใส่ฟังก์ชันได้
                },
                {
                    label: 'ชำระเงิน',
                    className: 'cursor-pointer font-light text-white bg-gray-900 px-5.5 py-2 text-sm rounded transition-all duration-100 hover:opacity-70',
                    onClick: (order: any) => { handleRepayOrder(order) },
                },
            ],
        },
        {
            status: 'processing',
            buttons: [
                {
                    label: 'ติดต่อร้านค้า',
                    className: 'cursor-pointer font-light text-gray-800 px-5.5 py-2 text-sm rounded border border-gray-300 transition-all duration-100 hover:border-gray-300 hover:bg-gray-100',
                    onClick: () => { },
                },
            ],
        },
        {
            status: 'shipped',
            buttons: [
                {
                    label: 'ติดตามพัสดุ',
                    className: 'cursor-pointer font-light text-gray-800 px-5.5 py-2 text-sm rounded border border-gray-300 transition-all duration-100 hover:border-gray-300 hover:bg-gray-100',
                    onClick: () => { },
                },
            ],
        },
        {
            status: 'delivered',
            buttons: [
                {
                    label: 'รีวิวสินค้า',
                    className: 'cursor-pointer font-light text-gray-800 px-5.5 py-2 text-sm rounded border border-gray-300 transition-all duration-100 hover:border-gray-300 hover:bg-gray-100',
                    onClick: () => { },
                },
                {
                    label: 'ซื้ออีกครั้ง',
                    className: 'cursor-pointer font-light text-gray-800 px-5.5 py-2 text-sm rounded border border-gray-300 transition-all duration-100 hover:border-gray-300 hover:bg-gray-100',
                    onClick: () => { },
                }
            ],
        },
        {
            status: 'cancelled',
            buttons: [
                {
                    label: 'ซื้ออีกครั้ง',
                    className: 'cursor-pointer font-light text-gray-800 px-5.5 py-2 text-sm rounded border border-gray-300 transition-all duration-100 hover:border-gray-300 hover:bg-gray-100',
                    onClick: () => { },
                },
            ],
        }
    ];
    const statusLabels: { [key: string]: string } = {
        'pending_payment': 'รอชำระเงิน',
        'processing': 'รอจัดส่ง',
        'shipped': 'กำลังจัดส่ง',
        'delivered': 'สำเร็จ',
        'cancelled': 'ยกเลิก',
        'refunded': 'คืนเงิน',
    }
    return (
        <div id="user-order-component" className='mt-5 mb-10'>
            <div>
                <div className='space-y-6 tracking-wide'>
                    {data?.orders?.map((order: any) => {
                        const items = order?.items || [];
                        return (
                            <div key={order.id} className='border border-gray-300 shadow-md'>
                                <div className='flex justify-between items-center border-b border-gray-300 p-4'>
                                    <div>
                                        <h2 className='font-light text-gray-800 mb-1'>{order.order_code}</h2>
                                        <div className='flex items-center gap-x-2'>
                                            <GoCalendar size={15} className='text-gray-500' />
                                            <p className='text-sm font-light text-gray-500'>{formatThaiDate(order.created_at)}</p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-x-10'>
                                        <div className='border border-gray-300 rounded-full px-3 py-1 flex items-center gap-x-3'>
                                            <div className='size-2 bg-black rounded-full'></div>
                                            <p className='uppercase font-light text-sm text-gray-800'>{statusLabels[order.order_status]}</p>
                                        </div>
                                        <div className='flex flex-col items-end'>
                                            <p className='font-light text-sm text-gray-500'>ทั้งหมด</p>
                                            <p className='text-gray-900 font-normal'>฿ {Number(order.total_amount).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-end justify-between border-b border-gray-300 p-4 '>
                                    <div className='flex items-stretch gap-x-4'>
                                        <div className='size-35  aspect-square relative border border-gray-300 shadow-sm  overflow-hidden'>
                                            {items[0]?.image_path ? (
                                                <Image className='absolute' fill src={items[0].image_path} alt={items[0].product_name || 'product name'} />
                                            ) : (
                                                <ProductNoImage image='small_image' />
                                            )}
                                        </div>
                                        <div className='flex flex-col justify-between items-start'>
                                            <div>
                                                <p className='text-gray-900 font-light text-md mb-2'>{items[0]?.name}</p>
                                                <p className='text-sm text-gray-500 font-light'>ไซส์ {items[0]?.size}</p>
                                                <p className='text-gray-900 font-normal'>฿ {Number(items[0]?.unit_price).toLocaleString()}</p>
                                            </div>
                                            <p className='text-sm text-gray-500 font-light'>x {items[0]?.quantity}</p>
                                        </div>
                                    </div>
                                    <div className='text-sm text-gray-500 font-light'>
                                        <p className='line-clamp-1'>{order.shipping_address.street} {order.shipping_address.sub_district} {order.shipping_address.district} {order.shipping_address.province} {order.shipping_address.zip_code}</p>
                                    </div>
                                </div>
                                <div className='p-4'>
                                    <div className='flex justify-between items-center'>
                                        <div>
                                            {order.items.length > 1 && (
                                                <button onClick={() => toggleOrderDetails(order.id)} className='cursor-pointer text-sm font-light text-gray-500 flex items-center gap-x-3'>
                                                    <p>รายละเอียดเพิ่มเติม</p>
                                                    <SlArrowDown className={orderDetails === order.id ? 'rotate-180 transition-transform duration-300' : ''} size={12} />
                                                </button>
                                            )}
                                        </div>
                                        <div className='flex items-center gap-x-4'>
                                            {(statusButtonConfig.find(cfg => cfg.status === order.order_status)?.buttons || []).map((btn, idx) => (
                                                <button key={idx} className={btn.className} onClick={() => btn.onClick(order)}>
                                                    <p>{btn.label}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {orderDetails === order.id && order.items.length > 1 && (
                                        <div className='space-y-5 mt-4 max-h-115 overflow-y-auto'>
                                            {order.items.slice(1).map((item: any) => (
                                                <div key={item.variant_id}>
                                                    <div className='flex items-stretch gap-x-4'>
                                                        <div className='size-35  aspect-square relative border border-gray-300 shadow-sm  overflow-hidden'>
                                                            {item.image_path ? (
                                                                <Image className='absolute' fill src={item.image_path} alt={item.product_name || 'product name'} />

                                                            ) : (
                                                                <ProductNoImage image='small_image' />
                                                            )}
                                                        </div>
                                                        <div className='flex flex-col justify-between items-start'>
                                                            <div>
                                                                <p className='text-gray-900 font-light text-md mb-2'>{item.name}</p>
                                                                <p className='text-sm text-gray-500 font-light'>ไซส์ {item.size}</p>
                                                                <p className='text-gray-900 font-normal'>฿ {Number(item.unit_price).toLocaleString()}</p>
                                                            </div>
                                                            <p className='text-sm text-gray-500 font-light'>x {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            {selectCancelOrderId && (
                <CancelOrderPopup mutate={mutate} order={selectCancelOrderId} onClose={() => setSelectCancelOrderId(null)} />
            )}
        </div>
    )
}

export const CancelOrderPopup: FC<CancelOrderPopupProps> = ({ mutate, order, onClose }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    const reasonsLabel = [
        { label: 'ต้องการเปลี่ยนที่อยู่จัดส่ง' },
        { label: 'ต้องการเปลี่ยนไซส์ สี หรือรุ่นสินค้า' },
        { label: 'ต้องการเปลี่ยนช่องทางชำระเงิน' },
        { label: 'ลืมใส่โค้ดส่วนลด / คูปอง' },
        { label: 'อื่นๆ' },
    ];
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const handleCancelOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (selectedReason) {
                const result = await Swal.fire({
                    title: 'ยืนยันการยกเลิกคำสั่งซื้อ',
                    text: `คุณต้องการยกเลิกคำสั่งซื้อนี้หรือไม่?`,
                    icon: 'warning',
                    confirmButtonText: 'ยืนยัน',
                    confirmButtonColor: '#d9534f',
                    showCancelButton: true,
                    cancelButtonColor: '#6B7280',
                    cancelButtonText: 'ยกเลิก'
                });
                if (!result.isConfirmed) return;
            }
            const response = await axios.put(`/api/user/order/${order.id}`, {
                cancelledReason: selectedReason
            });
            mutate();
            onClose();
            Swal.fire({
                title: 'ยกเลิกคำสั่งซื้อสำเร็จ',
                text: 'คำสั่งซื้อของคุณถูกยกเลิกเรียบร้อยแล้ว',
                icon: 'success',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#3085d6',
            });
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error("Error cancelling order:", error.response.data.error.message);
                Swal.fire({
                    title: 'ยกเลิกคำสั่งซื้อไม่สำเร็จ',
                    text: error.response.data.error.message || 'เกิดข้อผิดพลาดในการยกเลิกคำสั่งซื้อ',
                    icon: 'error',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#d9534f', // สีแดง (Bootstrap danger)
                });
            }
            console.error("Error cancelling order:", error);
        }
    }

    return (
        <div id="user-cancelled-order-popup-component">
            <div className="px-4 md:px-0 fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-75 max-w-150 w-full bg-white rounded-[5px] py-4 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-4 pb-4 mb-4'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className=' font-normal text-gray-800'>คุณต้องการยกเลิกคำสั่งซื้อนี้ใช่หรือไม่ ?</h2>
                        </div>
                        <button className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 onClick={onClose} size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-4 font-light '>
                        <div className='space-y-2 font-light text-sm border-b border-gray-300 pb-4 mb-4'>
                            <p><span className='text-gray-500'>รหัสคำสั่งซื้อ</span> {order.order_code}</p>
                            <p><span className='text-gray-500'>ยอดรวม</span> {Number(order.total_amount).toLocaleString()} บาท</p>
                        </div>
                        <form action="" onSubmit={handleCancelOrder} className=''>
                            <div className='text-gray-800 mb-4'>
                                <h2 className='flex flex-col gap-2 sm:flex-row text-xs sm:text-sm'>กรุณาเลือกเหตุผลที่คุณต้องการยกเลิกคำสั่งซื้อ เพื่อให้เรานำไปปรับปรุงบริการ  </h2>
                            </div>
                            <div className='flex flex-col gap-y-4 border-b border-[#E0E0E0] pb-4 mb-6'>
                                {reasonsLabel.map(reason => (
                                    <div key={reason.label} className='flex items-center gap-x-2'>
                                        <input
                                            type="radio"
                                            id={`reason-${reason.label}`}
                                            name="cancel-reason"
                                            value={reason.label}
                                            className='accent-gray-600'
                                            checked={selectedReason === reason.label}
                                            onChange={() => setSelectedReason(reason.label)}
                                        />
                                        <label className='text-sm text-gray-800 font-light' htmlFor={`reason-${reason.label}`}>{reason.label}</label>
                                    </div>
                                ))}
                            </div>
                            <div className='flex justify-end gap-x-4'>
                                <button onClick={onClose} type='button' className='text-sm  cursor-pointer rounded px-5 py-2 bg-white text-gray-700 font-light border border-gray-300 duration-200 hover:bg-gray-100'>ย้อนกลับ</button>
                                <button type='submit' className='text-sm  cursor-pointer rounded px-5 py-2 bg-black text-white font-light duration-200 hover:opacity-80 '>ยืนยัน</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
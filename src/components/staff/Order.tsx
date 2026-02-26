import React, { useState, useEffect, FC } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { DateTime } from 'luxon';
import Swal from 'sweetalert2';
import { RxCross2, RxReset } from 'react-icons/rx';
import Select from 'react-select/base';
import { GoCalendar, GoPlus, GoSearch } from 'react-icons/go';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import Image from 'next/image';
import { FaLayerGroup } from 'react-icons/fa';
import { IoDice, IoDiceSharp } from 'react-icons/io5';
import { AiFillInfoCircle } from 'react-icons/ai';
import DatePicker from 'react-datepicker';
import { BsFilterRight } from 'react-icons/bs';
import { PiNewspaperLight } from 'react-icons/pi';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const formatThaiDate = (dateString: string) => {
    return DateTime.fromISO(dateString)
        .plus({ hours: 7 })
        .setLocale('th')
        .toFormat('d LLLL yyyy HH:mm');
};

export const OrderList: FC<{ statusName: string }> = ({ statusName }) => {
    const sortMenuRef = React.useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchGlobal, setSearchGlobal] = useState('');
    const [searchGlobalDebounced, setSearchGlobalDebounced] = useState('');
    const [openOrderDetailModal, setOpenOrderDetailModal] = useState(null);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [startDate, endDate] = dateRange;
    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const [sortType, setSortType] = useState('newest');

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchGlobal(searchGlobalDebounced);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchGlobalDebounced]);

    const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        status_name: statusName.trim(),
        search_global: searchGlobal.trim(),
        start_date: startDate?.toISOString() || '',
        end_date: endDate?.toISOString() || '',
        sort_type: sortType
    });

    const { data: orders, error: orderError, mutate, isLoading: isLoadingOrders } = useSWR(`/api/staff/order?${params.toString()}`, fetcher,
        { onError: (err) => console.error('Error fetching orders:', err) });

    const ordersList = orders?.orders || [];
    const totalPages = orders?.pagination.totalPages || 1;

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    }

    const statusLabels: any = {
        'pending_payment': {
            label: 'รอชำระเงิน',
            borderColor: 'border-yellow-700',
            textColor: 'text-yellow-700',
            bgColor: 'bg-yellow-50'
        },
        'processing': {
            label: 'รอจัดส่ง',
            borderColor: 'border-blue-700',
            textColor: 'text-blue-700',
            bgColor: 'bg-blue-50'
        },
        'shipped': {
            label: 'กำลังจัดส่ง',
            borderColor: 'border-indigo-700',
            textColor: 'text-indigo-700',
            bgColor: 'bg-indigo-50'
        },
        'delivered': {
            label: 'สำเร็จ',
            borderColor: 'border-green-700',
            textColor: 'text-green-700',
            bgColor: 'bg-green-50'
        },
        'cancelled': {
            label: 'ยกเลิก',
            borderColor: 'border-red-700',
            textColor: 'text-red-700',
            bgColor: 'bg-red-50'
        },
        'refunded': {
            label: 'คืนเงินแล้ว',
            borderColor: 'border-gray-700',
            textColor: 'text-gray-700',
            bgColor: 'bg-gray-50'
        }
    }

    const handleReset = () => {
        setSearchGlobal('');
        setSearchGlobalDebounced('');
        setDateRange([null, null]);
        setCurrentPage(1);
        setSortType('newest');
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
                setSortMenuOpen(false);
            }
        }
        if (sortMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sortMenuOpen]);

    return (
        <div id="staff-order-list-component">
            <div>
                <h2 className='text-xl font-light text-gray-800 mb-4'>รายการคำสั่งซื้อ</h2>
                <div className='flex justify-between items-start'>
                    <div className='flex items-center gap-x-4'>
                        <div className='flex items-center gap-x-5'>
                            <div className="w-70 group flex items-center gap-x-4 border border-gray-300 hover:border-gray-500  px-4 py-2.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm">
                                <GoSearch className="text-gray-400 group-focus-within:text-gray-800 duration-300" size={20} />
                                <input value={searchGlobalDebounced} onChange={(e) => setSearchGlobalDebounced(e.target.value)} type="text" className="font-light text-sm w-full tracking-wide text-gray-600 focus:outline-none" placeholder="ค้นหาด้วยรหัส, ชื่อ, เบอร์" />
                            </div>
                        </div>
                        <div>
                            <div className='group flex items-center gap-x-2 border border-gray-300 px-4 duration-300 hover:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm'>
                                <GoCalendar size={20} className='text-gray-400 group-focus-within:text-gray-800 duration-300' />
                                <DatePicker
                                    selectsRange
                                    dateFormat="dd/MM/yyyy"
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={setDateRange}
                                    placeholderText='เลือก วัน / เดือน / ปี'
                                    className='text-sm px-4 py-2.5 font-light focus:outline-none text-gray-600'
                                />
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-x-4 mb-6'>
                        <div onClick={() => setSortMenuOpen(!sortMenuOpen)} className='relative w-fit border border-gray-300 p-2.5 hover:border-gray-500 shadow-sm cursor-pointer transition-all duration-300 active:scale-90'>
                            <BsFilterRight className="text-gray-600 duration-300" size={20} />
                            {sortMenuOpen && (
                                <div ref={sortMenuRef} className='z-20 absolute right-12 -bottom-0 bg-white pt-2'>
                                    <div className='border border-gray-300 w-35 shadow-sm'>
                                        <ul className='font-light text-gray-900 text-sm tracking-wide'>
                                            <li onClick={() => {
                                                setSortType('newest');

                                            }} className={`hover:bg-gray-200 p-3 cursor-pointer ${sortType === 'newest' ? 'bg-gray-200' : ''}`}>ใหม่ล่าสุด</li>
                                            <li onClick={() => {
                                                setSortType('oldest');

                                            }} className={`hover:bg-gray-200 p-3 cursor-pointer ${sortType === 'oldest' ? 'bg-gray-200' : ''}`}>เก่าที่สุด</li>
                                            <li onClick={() => {
                                                setSortType('price_high');

                                            }} className={`hover:bg-gray-200 p-3 cursor-pointer ${sortType === 'price_high' ? 'bg-gray-200' : ''}`}>ราคาสูงสุด</li>
                                            <li onClick={() => {
                                                setSortType('price_low');

                                            }} className={`hover:bg-gray-200 p-3 cursor-pointer ${sortType === 'price_low' ? 'bg-gray-200' : ''}`} >ราคาต่ำสุด</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div onClick={handleReset} className='w-fit border border-gray-300 p-2.5 hover:border-gray-500 shadow-sm cursor-pointer transition-all duration-300 hover:scale-110'>
                            <RxReset className="text-gray-600 duration-300" size={20} />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <table className='w-full text-sm text-left table-fixed'>
                    <thead className='text-gray-500 [&_th]:font-light bg-slate-50 border border-gray-300'>
                        <tr className=''>
                            <th className='px-2.5 py-2.5 w-[15%]'>รหัสคำสั่งซื้อ</th>
                            <th className=' w-[15%]'>วันสั่งซื้อ</th>
                            <th className=' w-[10%]'>ลูกค้า</th>
                            <th className=' w-[10%]'>ยอดรวม (บาท)</th>
                            <th className=' w-[10%]'>สถานะ</th>
                            <th className=' w-[10%]'>ขนส่ง</th>
                            <th className='text-center w-[10%]'>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className='text-gray-700 [&_td]:font-light [&>tr>td]:py-2.5'>
                        {isLoadingOrders ? (
                            // 💀 โซน Skeleton Loading (จำลองแถวขึ้นมา 5 แถว)
                            Array.from({ length: 10 }).map((_, index) => (
                                <tr className='border-b border-gray-300' key={`skeleton-${index}`}>
                                    <td className='px-2.5'><div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div></td>
                                    <td><div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div></td>
                                    <td className='pr-2.5'><div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div></td>
                                    <td><div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div></td>
                                    <td>
                                        {/* ทำ Skeleton ให้คล้าย Badge สถานะ */}
                                        <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                                    </td>
                                    <td><div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div></td>
                                    <td>
                                        {/* ทำ Skeleton ให้คล้ายปุ่มวงกลม Action */}
                                        <div className="flex items-center justify-center gap-x-4">
                                            <div className="size-9 bg-gray-200 rounded-full animate-pulse"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : ordersList.length === 0 ? (
                            <tr>
                                <td colSpan={7}>
                                    <div className='mt-20 h-full w-full flex flex-col items-center justify-center tracking-wide '>
                                        <div className='mb-10'>
                                            <PiNewspaperLight className="text-gray-400" size={40} />
                                        </div>
                                        <div className='flex items-center flex-col justify-center space-y-2 mb-6'>
                                            <h3 className='text-lg font-normal text-gray-800'>ยังไม่มีรายการสั่งซื้อ</h3>
                                            <p className='text-sm font-light text-gray-600'>กรุณารอให้ผู้ใช้งานทำการสั่งซื้อ</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : ordersList.map((order: any) => (
                            <tr className='border-b border-gray-300' key={order.order_id}>
                                <td title={order.order_code} className='px-2.5 truncate'>{order.order_code}</td>
                                <td>{formatThaiDate(order.created_at)}</td>
                                <td className='pr-2.5 truncate'>{order.customer_name}</td>
                                <td>{Number(order.total_amount).toLocaleString()}</td>
                                <td>
                                    <div className={`border ${statusLabels[order.order_status]?.borderColor} ${statusLabels[order.order_status]?.textColor} ${statusLabels[order.order_status]?.bgColor} rounded-full w-fit px-3 py-1`}>
                                        <p className='text-xs'>{statusLabels[order.order_status]?.label || '-'}</p>
                                    </div>
                                </td>
                                <td>{order.tracking_number || '-'}</td>
                                <td className=''>
                                    <div className="flex items-center justify-center gap-x-4">
                                        <button
                                            onClick={() => setOpenOrderDetailModal(order)}
                                            className="cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:border-gray-500 hover:shadow-[0px_0px_10px_#00000014]"
                                        >
                                            <IoIosInformationCircleOutline className="text-gray-600" size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {totalPages > 1 && (
                    <div id='pagination-footer' className='flex justify-end my-5'>
                        <div className='font-light flex items-center gap-x-5'>
                            <button
                                className='text-sm cursor-pointer text-gray-900 border border-gray-300 px-4 py-2 shadow rounded transition-all duration-300 ease-out hover:shadow-md'
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <SlArrowLeft size={10} />
                            </button>
                            <p className='cursor-default text-gray-900 text-sm'>{currentPage} / {totalPages}</p>
                            <button
                                className='text-sm cursor-pointer text-gray-900 border border-gray-300 px-4 py-2 shadow rounded transition-all duration-300 ease-out hover:shadow-md'
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <SlArrowRight size={10} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {openOrderDetailModal && <OrderDetailModal order={openOrderDetailModal} onClose={() => setOpenOrderDetailModal(null)} mutate={mutate} />}
        </div>
    )
}

interface OrderDetailModalProps {
    order: any;
    onClose: () => void;
    mutate: () => void;
}

export const OrderDetailModal: FC<OrderDetailModalProps> = ({ order, onClose, mutate }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const statusLabels: any = {
        'pending_payment': {
            label: 'รอชำระเงิน',
            borderColor: 'border-yellow-700',
            textColor: 'text-yellow-700',
            bgColor: 'bg-yellow-50'
        },
        'processing': {
            label: 'รอจัดส่ง',
            borderColor: 'border-blue-700',
            textColor: 'text-blue-700',
            bgColor: 'bg-blue-50'
        },
        'shipped': {
            label: 'กำลังจัดส่ง',
            borderColor: 'border-indigo-700',
            textColor: 'text-indigo-700',
            bgColor: 'bg-indigo-50'
        },
        'delivered': {
            label: 'สำเร็จ',
            borderColor: 'border-green-700',
            textColor: 'text-green-700',
            bgColor: 'bg-green-50'
        },
        'cancelled': {
            label: 'ยกเลิก',
            borderColor: 'border-red-700',
            textColor: 'text-red-700',
            bgColor: 'bg-red-50'
        },
        'refunded': {
            label: 'คืนเงินแล้ว',
            borderColor: 'border-gray-700',
            textColor: 'text-gray-700',
            bgColor: 'bg-gray-50'
        }
    }
    const [cancelOrderModal, setCancelOrderModal] = useState(null);
    const [trackingNumberModal, setTrackingNumberModal] = useState(null);

    const handleDelivered = async (orderId: number) => {
        try {
            if (orderId) {
                const confirmResult = await Swal.fire({
                    title: 'ยืนยันการอัปเดตสถานะคำสั่งซื้อ',
                    text: `คุณต้องการอัปเดตสถานะคำสั่งซื้อนี้เป็น "สำเร็จ" หรือไม่?`,
                    icon: 'question',
                    confirmButtonText: 'ยืนยัน',
                    confirmButtonColor: '#3085d6',
                    showCancelButton: true,
                    cancelButtonColor: '#6B7280',
                    cancelButtonText: 'ยกเลิก'
                });
                if (!confirmResult.isConfirmed) return;
            }
            const response = await axios.patch(`/api/staff/order/delivered/${orderId}`);
            Swal.fire({
                icon: 'success',
                title: response.data.message || 'อัปเดตสถานะคำสั่งซื้อเป็น "สำเร็จ" สำเร็จ',
                confirmButtonText: 'ตกลง'
            });
            mutate();
            onClose();
        } catch (error: unknown) {
            console.error('Error marking order as delivered:', error);
            if (axios.isAxiosError(error) && error.response) {
                Swal.fire({
                    icon: 'error',
                    title: 'การอัปเดตสถานะคำสั่งซื้อไม่สำเร็จ',
                    text: error.response.data.error.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะคำสั่งซื้อ',
                    confirmButtonText: 'ตกลง'
                });
                return;
            }
        }
    }
    const statusActionButton: any = {
        'pending_payment': (
            <div className='flex items-center justify-end gap-x-4'>
                <button onClick={onClose} type='button' className='text-sm  cursor-pointer rounded shadow px-5 py-2 bg-white text-gray-700 font-light border border-gray-300 duration-200 hover:bg-gray-100'>ปิด</button>
                <button onClick={() => setCancelOrderModal(order.order_id)} type='button' className='text-sm  cursor-pointer rounded px-5 py-2 bg-black text-white font-light duration-200 hover:opacity-80 '>ยกเลิกคำสั่งซื้อ</button>
            </div>
        ),
        'processing': (
            <div className='flex items-center justify-end gap-x-4'>
                <button onClick={onClose} type='button' className='text-sm  cursor-pointer rounded shadow px-5 py-2 bg-white text-gray-700 font-light border border-gray-300 duration-200 hover:bg-gray-100'>ปิด</button>
                <button onClick={() => setTrackingNumberModal(order.order_id)} type='button' className='text-sm  cursor-pointer rounded px-5 py-2 bg-black text-white font-light duration-200 hover:opacity-80 '>กรอกหมายเลขติดตาม</button>
            </div>
        ),
        'shipped': (
            <div className='flex items-center justify-end gap-x-4'>
                <button onClick={onClose} type='button' className='text-sm  cursor-pointer rounded shadow px-5 py-2 bg-white text-gray-700 font-light border border-gray-300 duration-200 hover:bg-gray-100'>ปิด</button>
                <button onClick={() => handleDelivered(order.order_id)} type='button' className='text-sm  cursor-pointer rounded px-5 py-2 bg-black text-white font-light duration-200 hover:opacity-80 '>ลูกค้ารับของแล้ว</button>
            </div>
        ),
        'default': (
            <div className='flex items-center justify-end gap-x-4'>
                <button onClick={onClose} type='button' className='text-sm  cursor-pointer rounded shadow px-5 py-2 bg-white text-gray-700 font-light border border-gray-300 duration-200 hover:bg-gray-100'>ปิด</button>
            </div >
        )

    }

    return (
        <div id="staff-order-detail-modal-component">
            <div className="px-4 md:px-0 fixed inset-0 z-30 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-75 max-w-180 w-full bg-white rounded-[5px] py-4 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-4 pb-4 mb-4'>
                        <div className='flex items-center gap-x-4'>
                            <h2 className=' font-normal text-gray-800'>{order.order_code}</h2>
                            <div className={`border ${statusLabels[order.order_status]?.borderColor} ${statusLabels[order.order_status]?.textColor} ${statusLabels[order.order_status]?.bgColor} rounded-full w-fit px-3 py-1`}>
                                <p className='text-xs font-light'>{statusLabels[order.order_status]?.label || '-'}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-4 font-light tracking-wide h-[70vh] overflow-y-auto'>
                        <div className='grid grid-cols-[1.5fr_1fr] h-full'>
                            <div className='border-r border-gray-300 mr-4'>
                                <div className='border-b border-gray-300 mr-4 mb-4 pb-4'>
                                    <h3 className='text-xs text-gray-700 mb-4'>รายการสินค้า ( {order.items?.length || 0} )</h3>
                                    <div className='space-y-4 max-h-72 overflow-y-auto pr-4'>
                                        {order.items?.map((item: any) => (
                                            <div key={item.variant_id}>
                                                <div className='flex justify-between items-start'>
                                                    <div className='flex items-start gap-x-4'>
                                                        <div className='relative size-15 border border-gray-300 shadow'>
                                                            {item?.image_path ? (
                                                                <Image src={item.image_path} alt={item.name} fill />
                                                            ) : (
                                                                <div className='size-full bg-gray-100 flex justify-center items-center flex-col gap-y-6'>
                                                                    <FaLayerGroup size={20} className=' text-gray-300 ' />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className='text-xs text-gray-800'>{item.name}</p>
                                                            <p className='text-xs text-gray-500'>{item.sku_code} (Size {item.size})</p>
                                                            <p className='text-xs'>x {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className='text-xs text-gray-800'>฿ {Number(item.subtotal).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='pr-4'>
                                    <h3 className='text-xs text-gray-700 mb-2'>สรุปยอดทั้งหมด</h3>
                                    <div className='space-y-2'>
                                        <div className='flex items-center justify-between'>
                                            <p className='text-xs text-gray-500'>ราคารวม</p>
                                            <p className='text-xs text-gray-800'>฿ {Number(order.total_amount).toLocaleString()}</p>
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <p className='text-xs text-gray-500'>ค่าส่ง</p>
                                            <p className='text-xs text-gray-800'>฿ 0</p>
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <p className='text-xs text-gray-500'>ยอดรวม</p>
                                            <p className='text-xs text-gray-800'>฿ {Number(order.total_amount).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col justify-between'>
                                <div>
                                    <div className='border-b border-gray-300 mb-4 pb-4'>
                                        <h3 className='text-xs text-gray-700 mb-2'>ข้อมูลลูกค้า</h3>
                                        <div className='space-y-2'>
                                            <div className='flex items-center gap-x-2'>
                                                <p className='text-xs text-gray-500'>ชื่อ</p>
                                                <p className='text-xs text-gray-800'>{order.customer_name}</p>
                                            </div>
                                            <div className='flex items-center gap-x-2'>
                                                <p className='text-xs text-gray-500'>เบอร์โทรศัพท์</p>
                                                <p className='text-xs text-gray-800'>{order.customer_phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='border-b border-gray-300 mb-4 pb-4'>
                                        <h3 className='text-xs text-gray-700 mb-2'>ข้อมูลที่อยู่จัดส่ง</h3>
                                        <div className='space-y-2'>
                                            <div className='flex items-center gap-x-2'>
                                                <p className='text-xs text-gray-500'>ชื่อผู้รับ</p>
                                                <p className='text-xs text-gray-800'>{order.shipping_address?.first_name} {order.shipping_address?.last_name}</p>
                                            </div>
                                            <div className='flex items-center gap-x-2'>
                                                <p className='text-xs text-gray-500'>เบอร์โทรศัพท์</p>
                                                <p className='text-xs text-gray-800'>{order.shipping_address?.phone}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-800'>
                                                    {order.shipping_address?.street} {order.shipping_address?.sub_district} {order.shipping_address?.district} {order.shipping_address?.province} {order.shipping_address?.zip_code}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {order.order_status === 'cancelled' && (
                                        <div className='border-b border-gray-300 mb-4 pb-4'>
                                            <h3 className='text-xs text-gray-700 mb-2'>ข้อมูลการยกเลิก</h3>
                                            <div className='space-y-2'>
                                                <div className='flex items-center gap-x-2'>
                                                    <p className='text-xs text-gray-500'>เหตุผลที่ยกเลิก</p>
                                                    <p className='text-xs text-gray-800'>{order.cancelled_reason}</p>
                                                </div>
                                                <div className='flex items-center gap-x-2'>
                                                    <p className='text-xs text-gray-500'>ชื่อผู้ยกเลิก</p>
                                                    <p className='text-xs text-gray-800'>{order.cancelled_by_name}</p>
                                                </div>
                                                <div className='flex items-center gap-x-2'>
                                                    <p className='text-xs text-gray-500'>ยกเลิกเมื่อ</p>
                                                    <p className='text-xs text-gray-800'>{formatThaiDate(order.cancelled_at)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className='border-b border-gray-300 mb-4 pb-4'>
                                        <h3 className='text-xs text-gray-700 mb-2'>ประวัติ</h3>
                                        <div className='space-y-2'>
                                            <div className='flex items-center gap-x-2'>
                                                <p className='text-xs text-gray-500'>สร้างเมื่อ</p>
                                                <p className='text-xs text-gray-800'>{formatThaiDate(order.created_at)}</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div>
                                    {statusActionButton[order.order_status] || statusActionButton['default']}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {cancelOrderModal && <CancelledOrderModal orderId={cancelOrderModal} onClose={() => setCancelOrderModal(null)} onCloseDetail={onClose} mutate={mutate} />}
            {trackingNumberModal && <TrackingNumberModal orderId={trackingNumberModal} onClose={() => setTrackingNumberModal(null)} onCloseDetail={onClose} mutate={mutate} />}
        </div>
    )
}

interface CancelledOrderModalProps {
    orderId: any;
    onClose: () => void;
    onCloseDetail: () => void;
    mutate: () => void;
}

export const CancelledOrderModal: FC<CancelledOrderModalProps> = ({ orderId, onClose, onCloseDetail, mutate }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const cancelledReason = [
        { label: 'ลูกค้าแจ้งขอยกเลิกคำสั่งซื้อ' },
        { label: 'ข้อมูลการชำระเงินไม่ถูกต้อง' },
        { label: 'ลูกค้าทำรายการซ้ำ' },
        { label: 'สินค้าหมด' },
        { label: 'อื่นๆ' }
    ];
    const [selectedReason, setSelectedReason] = useState('');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedReason) {
                const confirmResult = await Swal.fire({
                    title: 'ยืนยันการยกเลิกคำสั่งซื้อ',
                    text: `คุณต้องการยกเลิกคำสั่งซื้อนี้หรือไม่?`,
                    icon: 'question',
                    confirmButtonText: 'ยืนยัน',
                    confirmButtonColor: '#3085d6',
                    showCancelButton: true,
                    cancelButtonColor: '#6B7280',
                    cancelButtonText: 'ยกเลิก'
                });
                if (!confirmResult.isConfirmed) return;
            }
            const response = await axios.patch(`/api/staff/order/cancelled/${orderId}`, {
                cancelledReason: selectedReason
            });
            Swal.fire({
                icon: 'success',
                title: response.data.message || 'ยกเลิกคำสั่งซื้อสำเร็จ',
                confirmButtonText: 'ตกลง'
            });
            mutate();
            onClose();
            onCloseDetail();
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.log('ยกเลิกคำสั่งซื้อไม่สำเร็จ:', error.response.data.error.message);
                Swal.fire({
                    icon: 'error',
                    title: 'ยกเลิกคำสั่งซื้อไม่สำเร็จ',
                    text: error.response.data.error.message || 'เกิดข้อผิดพลาดในการยกเลิกคำสั่งซื้อ',
                    confirmButtonText: 'ตกลง'
                });
                return;
            }
            console.error('Error cancelling order:', error);
        }
    }

    return (
        <div id="staff-cancelled-order-modal-component">
            <div className="px-4 md:px-0 fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-75 max-w-100 w-full bg-white rounded-[5px] py-4 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-4 pb-4 mb-4'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className=' font-normal text-gray-800'>คุณต้องการยกเลิกคำสั่งซื้อนี้ใช่หรือไม่ ?</h2>
                        </div>
                        <button className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 onClick={onClose} size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-4 font-light '>
                        <form action="" onSubmit={handleSubmit} className=''>
                            <div className='text-gray-800 mb-4'>
                                <h2 className='flex flex-col gap-2 sm:flex-row text-xs sm:text-sm'>กรุณาเลือกเหตุผลที่คุณต้องการยกเลิกคำสั่งซื้อ เพื่อให้เรานำไปปรับปรุงบริการ  </h2>
                            </div>
                            <div className='flex flex-col gap-y-4 border-b border-[#E0E0E0] pb-4 mb-6'>
                                {cancelledReason.map(reason => (
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
                                <button onClick={onClose} type='button' className='text-sm  cursor-pointer rounded px-5 py-2 bg-white text-gray-700 font-light border border-gray-300 duration-200 hover:bg-gray-100'>ยกเลิก</button>
                                <button type='submit' className='text-sm  cursor-pointer rounded px-5 py-2 bg-black text-white font-light duration-200 hover:opacity-80 '>ยืนยัน</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface TrackingNumberModalProps {
    orderId: any;
    onClose: () => void;
    onCloseDetail: () => void;
    mutate: () => void;
}

export const TrackingNumberModal: FC<TrackingNumberModalProps> = ({ orderId, onClose, onCloseDetail, mutate }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const [trackingNumber, setTrackingNumber] = useState('');

    const generateTrackingNumber = async () => {
        const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
        setTrackingNumber(`DEV-${generatedCode}`);
    }

    const handleShipped = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (orderId && trackingNumber) {
                const confirmResult = await Swal.fire({
                    title: 'ยืนยันการอัปเดตสถานะคำสั่งซื้อ',
                    text: `คุณต้องการอัปเดตสถานะคำสั่งซื้อนี้เป็น "กำลังจัดส่ง" หรือไม่?`,
                    icon: 'question',
                    confirmButtonText: 'ยืนยัน',
                    confirmButtonColor: '#3085d6',
                    showCancelButton: true,
                    cancelButtonColor: '#6B7280',
                    cancelButtonText: 'ยกเลิก'
                });
                if (!confirmResult.isConfirmed) return;
            }
            const response = await axios.patch(`/api/staff/order/shipped/${orderId}`,
                { tracking_number: trackingNumber }
            );
            Swal.fire({
                icon: 'success',
                title: response.data.message || 'อัปเดตสถานะคำสั่งซื้อเป็น "กำลังจัดส่ง" สำเร็จ',
                confirmButtonText: 'ตกลง'
            });
            onClose();
            onCloseDetail();
            mutate();
        } catch (error: unknown) {
            console.error('Error marking order as shipped:', error);
            if (axios.isAxiosError(error) && error.response) {
                Swal.fire({
                    icon: 'error',
                    title: 'การอัปเดตสถานะคำสั่งซื้อไม่สำเร็จ',
                    text: error.response.data.error.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะคำสั่งซื้อ',
                    confirmButtonText: 'ตกลง'
                });
                return;
            }
        }
    }

    return (
        <div id="staff-tracking-number-modal-component">
            <div className="px-4 md:px-0 fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-80 max-w-100 w-full bg-white rounded-[5px] py-4 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-4 pb-4 mb-4'>
                        <div className='flex items-center gap-x-4'>
                            <h2 className=' font-normal text-gray-800'>กรอกหมายเลขจัดส่งสินค้า</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-4 font-light tracking-wide'>
                        <form action="" onSubmit={handleShipped} className='space-y-4'>
                            <div className='flex flex-col space-y-2'>
                                <label className='text-sm text-gray-700' htmlFor="tracking_number">หมายเลขติดตาม</label>
                                <div className='flex items-center gap-x-4'>
                                    <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} name='tracking_number' className="w-full border border-gray-300 hover:border-gray-500  px-4 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" autoFocus />
                                    <div onClick={generateTrackingNumber} className='border border-gray-300 rounded-full w-fit p-2 transition-all duration-100 ease-out hover:shadow-md hover:border-gray-400 cursor-pointer active:scale-90'>
                                        <IoDice size={25} className='text-gray-500' />
                                    </div>
                                </div>
                                <div className='flex items-center gap-x-2'>
                                    <AiFillInfoCircle size={20} className='text-gray-300' />
                                    <p className='text-xs text-gray-500'>กดปุ่มลูกเต๋าเพื่อสุ่มหมายเลขติดตาม</p>
                                </div>
                            </div>
                            <div className='flex justify-end gap-x-4'>
                                <button onClick={onClose} type='button' className='text-sm  cursor-pointer rounded shadow px-5 py-2 bg-white text-gray-700 font-light border border-gray-300 duration-200 hover:bg-gray-100'>ยกเลิก</button>
                                <button type='submit' className='text-sm  cursor-pointer rounded px-5 py-2 bg-black text-white font-light duration-200 hover:opacity-80 '>ยืนยัน</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}


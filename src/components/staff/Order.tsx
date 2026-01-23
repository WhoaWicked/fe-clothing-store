import React, { useState, useEffect, FC } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { DateTime } from 'luxon';
import Swal from 'sweetalert2';
import { RxCross2, RxReset } from 'react-icons/rx';
import Select from 'react-select/base';
import { GoPlus, GoSearch } from 'react-icons/go';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const formatThaiDate = (dateString: string) => {
    return DateTime.fromISO(dateString, { zone: 'utc' })
        .setZone('Asia/Bangkok')
        .setLocale('th')
        .toFormat('d LLLL yyyy HH:mm');
};

export const OrderList: FC<{ statusName: string }> = ({ statusName }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchGlobal, setSearchGlobal] = useState('');
    const [searchGlobalDebounced, setSearchGlobalDebounced] = useState('');

    const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        status_name: statusName,
        search_global: searchGlobal
    });

    const { data: orders, error: orderError, mutate } = useSWR(`/api/staff/order?${params.toString()}`, fetcher,
        { onError: (err) => console.error('Error fetching orders:', err) });

    const ordersList = orders?.orders || [];
    const totalPages = orders?.pagination.totalPages || 1;

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    }

    return (
        <div id="staff-order-list-component">
            <div>
                <h2 className='text-xl font-light text-gray-800 mb-4'>รายการคำสั่งซื้อ</h2>
                <div className='flex justify-between items-start'>
                    <div className='flex items-center gap-x-5'>
                        <div className="w-70 group flex items-center gap-x-4 border border-gray-300 hover:border-gray-500  px-4 py-2.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm">
                            <GoSearch className="text-gray-400 group-focus-within:text-gray-800 duration-300" size={20} />
                            <input type="text" className="font-light text-sm w-full tracking-wide text-gray-600 focus:outline-none" placeholder="ค้นหาด้วยรหัส, ชื่อ, เบอร์" />
                        </div>
                    </div>
                    <div className='flex items-center gap-x-5 mb-6'>
                        <div className='w-fit border border-gray-300 p-2.5 hover:border-gray-500 shadow-sm cursor-pointer transition-all duration-300 hover:scale-110'>
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
                            <th className=' w-[10%]'>สถานะชำระเงิน</th>
                            <th className=' w-[5%]'>ขนส่ง</th>
                            <th className='text-center w-[10%]'>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className='text-gray-900 [&_td]:font-light [&>tr>td]:py-2.5'>
                        {ordersList.map((order: any) => (
                            <tr className='border-b border-gray-300' key={order.order_id}>
                                <td title={order.order_code} className='px-2.5 truncate'>{order.order_code}</td>
                                <td>{formatThaiDate(order.created_at)}</td>
                                <td>{order.customer_name}</td>
                                <td>{Number(order.total_amount).toLocaleString()}</td>
                                <td>{order.payment_status}</td>
                                <td>{order.tracking_number || '-'}</td>
                                <td className=''>
                                    <div className="flex items-center justify-center gap-x-4">
                                        <button
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
        </div>
    )
}


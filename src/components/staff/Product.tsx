'use client';
import React, { useState, useEffect, FC } from 'react'
import useSWR from 'swr';
import axios from 'axios';
import { DateTime } from 'luxon';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { GoPlus, GoSearch } from 'react-icons/go';
import { FaLayerGroup } from 'react-icons/fa';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { CiEdit } from 'react-icons/ci';
import { PiTrashLight } from 'react-icons/pi';
import { RxReset } from 'react-icons/rx';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export const ProductList: FC = () => {
    const { data: products, error: productError, isLoading: isProductLoading, isValidating, mutate } = useSWR('/api/staff/product', fetcher,
        { onError: (err) => { console.error('Error fetching product data:', err); } }
    );

    return (
        <div id="staff-product-list-components" className='tracking-wide'>
            <div>
                <h2 className='text-xl font-light text-gray-800 mb-4'>รายการสินค้า</h2>
                <div className='flex justify-between items-start'>
                    <div className='flex items-center gap-x-5'>
                        <div className="w-70 group flex items-center gap-x-4 border border-gray-300 hover:border-gray-500  px-4 py-2.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm">
                            <GoSearch className="text-gray-400 group-focus-within:text-gray700 duration-300" size={20} />
                            <input type="text" className="font-light text-sm w-full tracking-wide text-gray-600 focus:outline-none" placeholder="ค้นหาด้วยรหัสสินค้า" />
                        </div>
                        <div className="w-70 group flex items-center gap-x-4 border border-gray-300 hover:border-gray-500  px-4 py-2.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm">
                            <GoSearch className="text-gray-400 group-focus-within:text-gray-800 duration-300" size={20} />
                            <input type="text" className="font-light text-sm w-full tracking-wide text-gray-600 focus:outline-none" placeholder="ค้นหาด้วยชื่อสินค้า" />
                        </div>
                    </div>
                    <div className='flex items-center gap-x-5 mb-6'>
                        <div className='w-fit border border-gray-300 p-2.5 hover:border-gray-500 shadow-sm cursor-pointer transition-all duration-300 hover:scale-110'>
                            <RxReset className="text-gray-600 duration-300" size={20} />
                        </div>
                        <button className='flex items-center gap-x-2 font-light bg-white text-sm cursor-pointer text-gray-700 border border-gray-300 shadow-sm hover:border-gray-500 hover:text-gray-900 px-4 py-2.5 hover:scale-105 transition-all duaration-300'>
                            <GoPlus size={20} />
                            <span>
                                เพิ่มสินค้าใหม่
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <div className='overflow-x-auto'>
                <table className='w-full text-sm text-left'>
                    <thead className='text-gray-500 [&_th]:font-light bg-slate-50 border border-gray-300'>
                        <tr className=''>
                            <th className='pl-2.5 py-2.5 w-[25%]'>สินค้า</th>
                            <th className='w-[10%]'>จำนวนสินค้า</th>
                            <th className='w-[15%]'>หมวดหมู่</th>
                            <th className='w-[10%]'>เพศ</th>
                            <th className='w-[10%]'>ราคา</th>
                            <th className='w-[10%]'>สถานะ</th>
                            <th className='w-[15%] text-center'>จัดการสินค้า</th>
                        </tr>
                    </thead>
                    <tbody className='text-gray-900 [&_td]:font-light [&>tr>td]:py-2.5'>
                        {products?.products?.map((product: any) => (
                            <tr key={product.product_id} className='border-b border-gray-300'>
                                <td className=''>
                                    <div className='flex items-center gap-x-4'>
                                        <div className='relative size-15 overflow-hidden border border-gray-300'>
                                            {product.image_path ? (
                                                <div>
                                                    <Image className='absolute' src={product.image_path || ''} alt={product.product_name || ''} fill />
                                                </div>
                                            ) : (
                                                <div className='size-full bg-gray-100 flex justify-center items-center flex-col gap-y-6'>
                                                    <FaLayerGroup size={20} className=' text-gray-300 ' />
                                                </div>
                                            )}
                                        </div>
                                        <div className='flex flex-col space-y-1'>
                                            <p>{product.product_name}</p>
                                            <p className='text-gray-500'>{product.product_code}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>{product.sum_stock_quantity}</td>
                                <td className=''>{product.category_name}</td>
                                <td>{product.gender_name}</td>
                                <td className=''>{Number(product.base_price).toLocaleString()}</td>
                                <td className="">
                                    <p className={`px-3 py-1 rounded-md text-xs border w-fit
                                    ${product.is_active
                                            ? 'border-green-200 text-green-600 bg-green-50'
                                            : 'border-red-200 text-red-600 bg-red-50'}`}
                                    >
                                        {product.is_active ? 'เปิดขาย' : 'ยกเลิก'}
                                    </p>
                                </td>
                                <td className=''>
                                    <div className="flex items-center justify-center gap-x-4">
                                        <button
                                            className="cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:border-gray-500 hover:shadow-[0px_0px_10px_#00000014]"
                                        >
                                            <IoIosInformationCircleOutline className="text-gray-600" size={20} />
                                        </button>
                                        <button
                                            className="cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:border-gray-500 hover:shadow-[0px_0px_10px_#00000014]"
                                        >
                                            <CiEdit className="text-gray-600" size={20} />
                                        </button>
                                        <button
                                            className="cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:border-gray-500 hover:shadow-[0px_0px_10px_#00000014]"
                                        >
                                            <PiTrashLight className="text-gray-600" size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    )
}

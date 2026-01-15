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
import { RxCross2, RxReset } from 'react-icons/rx';
import { useSearchParams } from 'next/navigation';
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import Select from 'react-select';
import ActiveSwitch from '../input/ActiveSwitch';


const fetcher = (url: string) => axios.get(url).then(res => res.data);

export const ProductList: FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchProductName, setSearchProductName] = useState('');
    const [productName, setProductName] = useState('');
    const [searchProductCode, setSearchProductCode] = useState('');
    const [productCode, setProductCode] = useState('');
    const [openProductModal, setOpenProductModal] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setProductName(searchProductName);
            setProductCode(searchProductCode);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchProductName, searchProductCode]);

    const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        product_name: productName,
        product_code: productCode,
    });
    const { data: products, error: productError, isLoading: isProductLoading, isValidating, mutate } = useSWR(`/api/staff/product?${params.toString()}`, fetcher,
        { onError: (err) => { console.error('Error fetching product data:', err); } }
    );

    const productList = products?.products || [];
    const totalPages = products?.pagination?.totalPages || 1;

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div id="staff-product-list-components" className='tracking-wide'>
            <div>
                <h2 className='text-xl font-light text-gray-800 mb-4'>รายการสินค้า</h2>
                <div className='flex justify-between items-start'>
                    <div className='flex items-center gap-x-5'>
                        <div className="w-70 group flex items-center gap-x-4 border border-gray-300 hover:border-gray-500  px-4 py-2.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm">
                            <GoSearch className="text-gray-400 group-focus-within:text-gray-800 duration-300" size={20} />
                            <input onChange={(e) => setSearchProductName(e.target.value)} type="text" className="font-light text-sm w-full tracking-wide text-gray-600 focus:outline-none" placeholder="ค้นหาด้วยชื่อสินค้า" />
                        </div>
                        <div className="w-70 group flex items-center gap-x-4 border border-gray-300 hover:border-gray-500  px-4 py-2.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm">
                            <GoSearch className="text-gray-400 group-focus-within:text-gray700 duration-300" size={20} />
                            <input onChange={(e) => setSearchProductCode(e.target.value)} type="text" className="font-light text-sm w-full tracking-wide text-gray-600 focus:outline-none" placeholder="ค้นหาด้วยรหัสสินค้า" />
                        </div>
                    </div>
                    <div className='flex items-center gap-x-5 mb-6'>
                        <div className='w-fit border border-gray-300 p-2.5 hover:border-gray-500 shadow-sm cursor-pointer transition-all duration-300 hover:scale-110'>
                            <RxReset className="text-gray-600 duration-300" size={20} />
                        </div>
                        <button onClick={() => setOpenProductModal(true)} className='flex items-center gap-x-2 font-light bg-white text-sm cursor-pointer text-gray-700 border border-gray-300 shadow-sm hover:border-gray-500 hover:text-gray-900 px-4 py-2.5 hover:scale-105 transition-all duaration-300'>
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
                        {productList?.map((product: any) => (
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
                                <td className=''>{Number(product.base_price).toLocaleString()} ฿</td>
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
            {openProductModal && <AddProductModal mutate={mutate} onClose={() => setOpenProductModal(false)} />}
        </div >
    )
}

interface AddProductModalProps {
    mutate: () => void;
    onClose: () => void;
}

const AddProductModal: FC<AddProductModalProps> = ({ onClose, mutate }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const [isActive, setIsActive] = useState(1);
    const [isBestSeller, setIsBestSeller] = useState(0);
    const [countSizeInput, setCountSizeInput] = useState(1);
    const genderMenu = [
        { value: 'ชาย', label: 'ชาย' },
        { value: 'หญิง', label: 'หญิง' },
        { value: 'เด็ก', label: 'เด็ก' }
    ]
    return (
        <div id="user-cancelled-order-popup-component">
            <div className="px-4 md:px-0 fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-75 max-w-180 w-full bg-white rounded-[5px] py-4 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-4 pb-4 mb-4'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className=' font-normal text-gray-800'>เพิ่มรายการสินค้า</h2>
                        </div>
                        <button className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 onClick={onClose} size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-4 font-light '>
                        <div>
                            <form action="" className='grid grid-cols-[2fr_1.5fr] gap-x-4'>
                                <div className='space-y-5 border-r border-gray-300 pr-4 mb-4'>
                                    <div className='flex flex-col space-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="first_name">ชื่อสินค้า</label>
                                        <input className="w-full border border-gray-300 hover:border-gray-500  px-4 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" autoFocus />
                                    </div>
                                    <div className='flex flex-col space-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="first_name">รายละเอียด</label>
                                        <textarea className="w-full h-20 border border-gray-300 hover:border-gray-500  p-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" />
                                    </div>
                                    <div className='flex items-center gap-x-4'>
                                        <label className='text-sm text-gray-700' htmlFor="first_name">ราคา (บาท)</label>
                                        <input className="w-30 border border-gray-300 hover:border-gray-500  px-4 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='0.00' />
                                    </div>
                                    <div>
                                        <button type='button' onClick={() => setCountSizeInput(countSizeInput + 1)} className='flex items-center gap-x-2 font-light bg-white text-sm cursor-pointer text-gray-700 border border-gray-300 shadow-sm hover:border-gray-500 hover:text-gray-900 px-3 py-2 hover:scale-105 transition-all duaration-300'>
                                            <GoPlus size={20} />
                                            <span>
                                                เพิ่มไซส์สินค้า
                                            </span>
                                        </button>
                                    </div>
                                    <div className='space-y-5 h-53 overflow-y-auto pr-3'>
                                        {Array.from({ length: countSizeInput }).map((_, index) => (
                                            <div key={index} className='flex items-center gap-x-4'>
                                                <p className='text-base text-gray-700'>{index + 1}</p>
                                                <div className='flex items-center justify-between gap-x-4 w-full'>
                                                    <div className='flex items-center gap-x-4'>
                                                        <label className='text-sm text-gray-700' htmlFor="first_name">ไซส์</label>
                                                        <input className="w-full border border-gray-300 hover:border-gray-500  px-4 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='M' />
                                                    </div>
                                                    <div className='flex items-center gap-x-4'>
                                                        <label className='text-sm text-gray-700' htmlFor="first_name">จำนวน</label>
                                                        <input className="w-full border border-gray-300 hover:border-gray-500  px-4 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='100' />
                                                    </div>
                                                    <div>
                                                        <PiTrashLight onClick={() => {
                                                            if (countSizeInput > 1) {
                                                                setCountSizeInput(countSizeInput - 1);
                                                            }
                                                        }} size={25} className='cursor-pointer text-gray-600 transition-all duration-300 hover:scale-110' />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='space-y-5'>
                                    <div className='flex flex-col space-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="first_name">รูปภาพสินค้า</label>
                                        <div className='bg-slate-200 h-40'>
                                            <div className='flex justify-center items-center h-full'>
                                                <p className='text-sm text-gray-500 tracking-wide'>ลากและวางไฟล์ที่นี่</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col space-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="first_name">หมวดหมู่</label>
                                        <Select />
                                    </div>
                                    <div className='flex flex-col space-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="first_name">เพศ</label>
                                        <div className='flex items-center gap-x-8'>
                                            {genderMenu?.map((gender) => (
                                                <div key={gender.value} className='flex items-center gap-x-2'>
                                                    <input className='accent-gray-600' id={`gender-${gender.value}`} type='radio' name="gender" value={gender.value} />
                                                    <label className='text-sm text-gray-800 font-light ' htmlFor={`gender-${gender.value}`}>{gender.label}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="first_name">สถานะการใช้งาน</label>
                                        <ActiveSwitch checked={isActive} onChange={setIsActive} />
                                    </div>
                                    <div className='flex flex-col gap-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="first_name">สินค้าขายดี</label>
                                        <ActiveSwitch checked={isBestSeller} onChange={setIsBestSeller} />
                                    </div>
                                    <div className='flex justify-end gap-x-4'>
                                        <button onClick={onClose} type='button' className='text-sm  cursor-pointer rounded shadow px-5 py-2 bg-white text-gray-700 font-light border border-gray-300 duration-200 hover:bg-gray-100'>ยกเลิก</button>
                                        <button type='submit' className='text-sm  cursor-pointer rounded px-5 py-2 bg-black text-white font-light duration-200 hover:opacity-80 '>เพิ่มสินค้า</button>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

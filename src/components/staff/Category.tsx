'use client';
import React, { useState, useEffect, FC } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { DateTime } from 'luxon';
import Swal from 'sweetalert2';
import Select from 'react-select';
import ActiveSwitch from '../input/ActiveSwitch';
import { GoPlus, GoSearch } from 'react-icons/go';
import { RxCross2, RxReset } from 'react-icons/rx';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { CiEdit } from 'react-icons/ci';
import { IoCheckmarkDoneOutline } from 'react-icons/io5';
import { PiTrashLight } from 'react-icons/pi';
import { FaLayerGroup } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const formatThaiDate = (dateString: string) => {
    return DateTime.fromISO(dateString)
        .plus({ hours: 7 })
        .setLocale('th')
        .toFormat('d LLLL yyyy HH:mm');
};

export const CategoryList: FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [category_name, setCategoryName] = useState('');
    const [category_code, setCategoryCode] = useState('');
    const [searchCategoryName, setSearchCategoryName] = useState('');
    const [searchCategoryCode, setSearchCategoryCode] = useState('');
    const [isOpenAddCategoryModal, setIsOpenAddCategoryModal] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCategoryName(searchCategoryName);
            setCategoryCode(searchCategoryCode);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchCategoryName, searchCategoryCode]);

    const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        category_name: category_name.trim(),
        category_code: category_code.trim(),
    });

    const { data: categories, error: categoriesError, isLoading: categoriesLoading, mutate } = useSWR(`/api/staff/category?${params.toString()}`, fetcher,
        { onError: (err) => { console.error('Error fetching categories:', err); } });

    const categoryList = categories?.categories || [];
    const totalPages = categories?.pagination?.totalPages || 1;

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleUpdateCategoryStatus = async (category: any, isActive: boolean) => {
        try {
            const { category_name, category_id } = category;
            const response = await axios.put(`/api/staff/category/${category_id}`,
                {
                    category_name,
                    is_active: isActive
                }
            );
            mutate();
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Update Category Status error response:', error.response.data);
                Swal.fire({
                    icon: 'error',
                    title: 'อัปเดตสถานะหมวดหมู่ไม่สำเร็จ',
                    text: error.response.data.error.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะสินค้า',
                    confirmButtonText: 'ตกลง'
                });
                return;
            }
            console.error('Update Category Status error:', error);
        }
    }

    const [selectIdCategory, setSelectIdCategory] = useState<any>(null);
    const [editCategoryName, setEditCategoryName] = useState('');
    const [loading, setLoading] = useState(false);
    const handleUpdateCategory = async (category: any) => {
        try {
            const { category_id, is_active, category_name } = category;
            if (category_id && editCategoryName && is_active !== undefined) {
                const confirmResult = await Swal.fire({
                    title: 'ยืนยันการแก้ไขหมวดหมู่',
                    text: `คุณต้องการแก้ไขหมวดหมู่ ${category_name} นี้หรือไม่?`,
                    icon: 'question',
                    confirmButtonText: 'ยืนยัน',
                    confirmButtonColor: '#3085d6',
                    showCancelButton: true,
                    cancelButtonColor: '#6B7280',
                    cancelButtonText: 'ยกเลิก'
                });
                if (!confirmResult.isConfirmed) return;
            }
            setLoading(true);
            const response = await axios.put(`/api/staff/category/${category_id}`,
                {
                    category_name: editCategoryName,
                    is_active
                }
            );
            setSelectIdCategory(null);
            setEditCategoryName('');
            mutate();
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Update Category error response:', error.response.data);
                Swal.fire({
                    icon: 'error',
                    title: 'อัปเดตหมวดหมู่ไม่สำเร็จ',
                    text: error.response.data.error.message || 'เกิดข้อผิดพลาดในการอัปเดตหมวดหมู่',
                    confirmButtonText: 'ตกลง'
                });
                return;
            }
            console.error('Update Category error:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteCategory = async (category: any) => {
        try {
            const { category_id, category_name } = category;
            const confirmResult = await Swal.fire({
                title: 'ยืนยันการลบหมวดหมู่',
                text: `คุณต้องการลบหมวดหมู่ ${category_name} นี้หรือไม่?`,
                icon: 'warning',
                confirmButtonText: 'ยืนยัน',
                confirmButtonColor: '#d33',
                showCancelButton: true,
                cancelButtonColor: '#6B7280',
                cancelButtonText: 'ยกเลิก'
            });
            if (!confirmResult.isConfirmed) return;
            const response = await axios.delete(`/api/staff/category/${category_id}`);
            Swal.fire({
                icon: 'success',
                title: response.data.message || 'ลบหมวดหมู่สำเร็จ',
                confirmButtonText: 'ตกลง'
            });
            mutate();
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Delete Category error response:', error.response.data);
                Swal.fire({
                    icon: 'error',
                    title: 'ลบหมวดหมู่ไม่สำเร็จ',
                    text: error.response.data.error.message || 'เกิดข้อผิดพลาดในการลบหมวดหมู่',
                    confirmButtonText: 'ตกลง'
                });
                return;
            }
            console.error('Delete Category error:', error);
        }
    }
    const handleReset = () => {
        setSearchCategoryName('');
        setSearchCategoryCode('');
        setCategoryName('');
        setCategoryCode('');
        setCurrentPage(1);
    }
    return (
        <div id="staff-category-list-component">
            <div>
                <h2 className='text-xl font-light text-gray-800 mb-4'>รายการหมวดหมู่</h2>
                <div className='flex justify-between items-start'>
                    <div className='flex items-center gap-x-5'>
                        <div className="w-70 group flex items-center gap-x-4 border border-gray-300 hover:border-gray-500  px-4 py-2.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm">
                            <GoSearch className="text-gray-400 group-focus-within:text-gray-800 duration-300" size={20} />
                            <input value={searchCategoryName} type="text" onChange={(e) => setSearchCategoryName(e.target.value)} className="font-light text-sm w-full tracking-wide text-gray-600 focus:outline-none" placeholder="ค้นหาด้วยชื่อหมวดหมู่" />
                        </div>
                        <div className="w-70 group flex items-center gap-x-4 border border-gray-300 hover:border-gray-500  px-4 py-2.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm">
                            <GoSearch className="text-gray-400 group-focus-within:text-gray700 duration-300" size={20} />
                            <input value={searchCategoryCode} type="text" onChange={(e) => setSearchCategoryCode(e.target.value)} className="font-light text-sm w-full tracking-wide text-gray-600 focus:outline-none" placeholder="ค้นหาด้วยรหัสหมวดหมู่" />
                        </div>
                    </div>
                    <div className='flex items-center gap-x-5 mb-6'>
                        <div onClick={handleReset} className='w-fit border border-gray-300 p-2.5 hover:border-gray-500 shadow-sm cursor-pointer transition-all duration-300 hover:scale-110'>
                            <RxReset className="text-gray-600 duration-300" size={20} />
                        </div>
                        <button onClick={() => setIsOpenAddCategoryModal(true)} className='flex items-center gap-x-2 font-light bg-white text-sm cursor-pointer text-gray-700 border border-gray-300 shadow-sm hover:border-gray-500 hover:text-gray-900 px-4 py-2.5 hover:scale-105 transition-all duaration-300'>
                            <GoPlus size={20} />
                            <span>
                                เพิ่มหมวดหมู่
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <div className=''>
                <table className='w-full text-sm text-left table-fixed'>
                    <thead className='text-gray-500 [&_th]:font-light bg-slate-50 border border-gray-300'>
                        <tr className=''>
                            <th className='pl-2.5 py-2.5 w-[20%]'>ชื่อหมวดหมู่</th>
                            <th className='w-[20%]'>รหัสหมวดหมู่</th>
                            <th className='w-[15%]'>วันที่สร้าง</th>
                            <th className='w-[15%]'>ผู้สร้าง</th>
                            <th className='w-[10%]'>สถานะการใช้งาน</th>
                            <th className='w-[15%] text-center'>แก้ไข</th>
                        </tr>
                    </thead>
                    <tbody className='text-gray-700 [&_td]:font-light [&>tr>td]:py-2.5'>
                        {categoriesLoading ? (
                            // 💀 โซน Skeleton Loading (จำลองแถวขึ้นมา 5 แถว)
                            Array.from({ length: 10 }).map((_, index) => (
                                <tr className='h-15 border-b border-gray-300' key={`skeleton-category-${index}`}>
                                    {/* ชื่อหมวดหมู่ */}
                                    <td className='pl-2.5'><div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div></td>
                                    {/* รหัสหมวดหมู่ */}
                                    <td><div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div></td>
                                    {/* วันที่สร้าง */}
                                    <td><div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div></td>
                                    {/* ผู้สร้าง */}
                                    <td><div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div></td>
                                    {/* สถานะการใช้งาน (จำลองสวิตช์ Toggle) */}
                                    <td>
                                        <div className='flex justify-center items-center'>
                                            <div className="h-6 w-11 bg-gray-200 rounded-full animate-pulse"></div>
                                        </div>
                                    </td>
                                    {/* แก้ไข (จำลองปุ่ม Action 2 ปุ่มติดกัน) */}
                                    <td>
                                        <div className="flex items-center justify-center gap-x-4">
                                            <div className="size-9 bg-gray-200 rounded-full animate-pulse"></div>
                                            <div className="size-9 bg-gray-200 rounded-full animate-pulse"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : categoryList.length === 0 ? (
                            <tr>
                                <td colSpan={6}>
                                    <div className='mt-20 h-full w-full flex flex-col items-center justify-center tracking-wide '>
                                        <div className='mb-10'>
                                            <FaLayerGroup size={40} className=' text-gray-300 ' />
                                        </div>
                                        <div className='flex items-center flex-col justify-center space-y-2 mb-6'>
                                            <h3 className='text-lg font-normal text-gray-800'>ยังไม่มีรายการหมวดหมู่</h3>
                                            <p className='text-sm font-light text-gray-600'>กรุณาทำการเพิ่มรายการหมวดหมู่</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : categoryList?.map((category: any) => (
                            <tr key={category.category_id} className='h-15 border-b border-gray-300'>
                                {selectIdCategory !== category.category_id ? (
                                    <td title={category.category_name} className='px-2.5 truncate'>{category.category_name}</td>
                                ) : (
                                    <td className='pl-2.5'>
                                        <input value={editCategoryName} onChange={(e) => setEditCategoryName(e.target.value)} autoFocus className='w-[90%] border border-gray-300 hover:border-gray-500 text-sm px-4 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none' type="text" />
                                    </td>
                                )}
                                <td title={category.category_code} className='truncate pr-2.5'>{category.category_code}</td>
                                <td>{formatThaiDate(category.created_at)}</td>
                                <td>{category.creator_name}</td>
                                <td className=''>
                                    <div className='flex justify-center items-center'>
                                        <ActiveSwitch checked={category.is_active} onChange={(isChecked: boolean) => handleUpdateCategoryStatus(category, isChecked)} activeText='' inactiveText='' />
                                    </div>
                                </td>
                                <td className=''>
                                    {selectIdCategory !== category.category_id ? (
                                        <div className="flex items-center justify-center gap-x-4">
                                            <button onClick={() => {
                                                setSelectIdCategory(category.category_id);
                                                setEditCategoryName(category.category_name);
                                            }}
                                                type='button'
                                                className="cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:border-gray-500 hover:shadow-[0px_0px_10px_#00000014]"
                                            >
                                                <CiEdit className="text-gray-600" size={20} />
                                            </button>
                                            <button
                                                type='button'
                                                onClick={() => handleDeleteCategory(category)}
                                                className="cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:border-gray-500 hover:shadow-[0px_0px_10px_#00000014]"
                                            >
                                                <PiTrashLight className="text-gray-600" size={20} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className='flex items-center justify-center gap-x-4'>
                                            <button
                                                disabled={loading}
                                                onClick={() => {
                                                    setSelectIdCategory(null)
                                                    setEditCategoryName('');
                                                }}
                                                className="cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:border-gray-500 hover:shadow-[0px_0px_10px_#00000014]"
                                            >
                                                <RxCross2 className="text-gray-500" size={20} />
                                            </button>
                                            <button
                                                disabled={loading}
                                                onClick={() => handleUpdateCategory(category)}
                                                className="cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:border-gray-500 hover:shadow-[0px_0px_10px_#00000014]"
                                            >
                                                {loading ? <AiOutlineLoading3Quarters className='animate-spin size-4' /> : <IoCheckmarkDoneOutline className="text-gray-600" size={20} />}
                                            </button>
                                        </div>
                                    )}
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
            {isOpenAddCategoryModal && <AddCategoryModal onClose={() => setIsOpenAddCategoryModal(false)} mutate={mutate} />}
        </div>
    )
}

interface AddCategorryModalProps {
    onClose: () => void;
    mutate: () => void;
}

export const AddCategoryModal: FC<AddCategorryModalProps> = ({ onClose, mutate }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [])

    const [category_name, setCategoryName] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (category_name) {
                const confirmResult = await Swal.fire({
                    title: 'ยืนยันการเพิ่มหมวดหมู่',
                    text: `คุณต้องการเพิ่มหมวดหมู่ "${category_name}" หรือไม่?`,
                    icon: 'question',
                    confirmButtonText: 'ยืนยัน',
                    confirmButtonColor: '#3085d6',
                    showCancelButton: true,
                    cancelButtonColor: '#6B7280',
                    cancelButtonText: 'ยกเลิก'
                });
                if (!confirmResult.isConfirmed) return;
            }
            setLoading(true);
            const response = await axios.post('/api/staff/category', {
                category_name
            });
            Swal.fire({
                icon: 'success',
                title: 'เพิ่มหมวดหมู่สำเร็จ',
                confirmButtonText: 'ตกลง'
            });
            mutate();
            onClose();
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Add Category error response:', error.response.data);
                Swal.fire({
                    icon: 'error',
                    title: 'เพิ่มหมวดหมู่ไม่สำเร็จ',
                    text: error.response.data.error.message || 'เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่',
                    confirmButtonText: 'ตกลง'
                });
                return;
            }
            console.error('Add Category error:', error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div id="staff-add-category-modal-component">
            <div className="px-4 md:px-0 fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-80 max-w-100 w-full bg-white rounded-[5px] py-4 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-4 pb-4 mb-4'>
                        <div className='flex items-center gap-x-4'>
                            <h2 className=' font-normal text-gray-800'>เพิ่มหมวดหมู่</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-4 font-light tracking-wide'>
                        <form action="" onSubmit={handleSubmit} className='space-y-4'>
                            <div className='flex flex-col space-y-2'>
                                <label className='text-sm text-gray-700' htmlFor="category_name">ชื่อหมวดหมู่</label>
                                <input onChange={(e) => setCategoryName(e.target.value)} name='category_name' className="w-full border border-gray-300 hover:border-gray-500  px-4 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" autoFocus />
                            </div>
                            <div className='flex justify-end gap-x-4'>
                                <button onClick={onClose} type='button' className='text-sm  cursor-pointer rounded shadow px-5 py-2 bg-white text-gray-700 font-light border border-gray-300 duration-200 hover:bg-gray-100'>ยกเลิก</button>
                                <button
                                    type='submit'
                                    disabled={loading}
                                    className='text-sm cursor-pointer rounded px-5 py-2 bg-black text-white font-light duration-200 hover:opacity-80 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-x-2'
                                >
                                    {loading ? (
                                        <>
                                            <AiOutlineLoading3Quarters className='animate-spin size-4' />
                                            <span>กำลังเพิ่ม</span>
                                        </>
                                    ) : (
                                        <span>เพิ่ม</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
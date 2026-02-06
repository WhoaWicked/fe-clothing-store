'use client';
import React, { useState, useEffect, FC, useRef } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { RxCross2, RxReset } from 'react-icons/rx';
import Swal from 'sweetalert2';
import { GoPlus, GoSearch } from 'react-icons/go';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import ActiveSwitch from '../input/ActiveSwitch';
import { FaLayerGroup } from 'react-icons/fa';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { BsFilterRight } from 'react-icons/bs';
import Select from 'react-select';
import { DateTime } from 'luxon';
import { PiTrashLight, PiUser } from 'react-icons/pi';
import { CiEdit } from 'react-icons/ci';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const formatThaiDate = (dateString: string) => {
    return DateTime.fromISO(dateString)
        .plus({ hours: 7 })
        .setLocale('th')
        .toFormat('d LLLL yyyy HH:mm');
};

export const UserList: FC = () => {
    const sortMenuRef = React.useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchGlobal, setSearchGlobal] = useState('');
    const [searchGlobalDebounced, setSearchGlobalDebounced] = useState('');
    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const [sortType, setSortType] = useState('newest');
    const [addUserPopupOpen, setAddUserPopupOpen] = useState(false);
    const [userDetailPopupOpen, setUserDetailPopupOpen] = useState(null);

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
        search_global: searchGlobal.trim(),
        sort_type: sortType.trim(),
    });

    const { data: users, error: userError, isLoading: userLoading, mutate } = useSWR(`/api/admin/manage-user?${params.toString()}`, fetcher);
    const usersList = users?.users || [];
    const totalPages = users?.pagination?.totalPages || 1;

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
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

    const handleUpdateStatus = async (userId: any, isActive: boolean) => {
        try {
            const response = await axios.patch(`/api/admin/manage-user/${userId}`,
                { is_active: isActive, });
            mutate();
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Update User Status error response:', error.response.data);
                Swal.fire({
                    icon: 'error',
                    title: 'อัปเดตสถานะผู้ใช้งานไม่สำเร็จ',
                    text: error.response.data.error.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะผู้ใช้งาน',
                    confirmButtonText: 'ตกลง'
                });
                return;
            }
            console.error('Update User Status error:', error);
        }
    }

    return (
        <div id="admin-user-list-component">
            <div>
                <h2 className='text-xl font-light text-gray-800 mb-4'>รายการผู้ใช้งาน</h2>
                <div className='flex justify-between items-start'>
                    <div className='flex items-center gap-x-5'>
                        <div className="w-70 group flex items-center gap-x-4 border border-gray-300 hover:border-gray-500  px-4 py-2.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm">
                            <GoSearch className="text-gray-400 group-focus-within:text-gray-800 duration-300" size={20} />
                            <input value={searchGlobalDebounced} onChange={(e) => setSearchGlobalDebounced(e.target.value)} type="text" className="font-light text-sm w-full tracking-wide text-gray-600 focus:outline-none" placeholder="ค้นหาด้วยชื่อ, อีเมล, เบอร์" />
                        </div>
                    </div>
                    <div className='flex items-center gap-x-5 mb-6'>
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
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='w-fit border border-gray-300 p-2.5 hover:border-gray-500 shadow-sm cursor-pointer transition-all duration-300 hover:scale-110'>
                            <RxReset className="text-gray-600 duration-300" size={20} />
                        </div>
                        <button onClick={() => setAddUserPopupOpen(true)} className='flex items-center gap-x-2 font-light bg-white text-sm cursor-pointer text-gray-700 border border-gray-300 shadow-sm hover:border-gray-500 hover:text-gray-900 px-4 py-2.5 hover:scale-105 transition-all duaration-300'>
                            <GoPlus size={20} />
                            <span>
                                เพิ่มเจ้าหน้าที่
                            </span>
                        </button>
                    </div>
                </div>
                <div>
                    <table className='w-full text-sm text-left table-fixed'>
                        <thead className='text-gray-500 [&_th]:font-light bg-slate-50 border border-gray-300'>
                            <tr className=''>
                                <th className='px-2.5 py-2.5 w-[15%]'>ชื่อผู้ใช้</th>
                                <th className='w-[15%]'>ชื่อจริง</th>
                                <th className='w-[15%]'>อีเมล</th>
                                <th className='w-[15%]'>เบอร์โทรศัพท์</th>
                                <th className='w-[15%]'>บทบาท</th>
                                <th className='w-[10%]'>สถานะ</th>
                                <th className='w-[10%] text-center'>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className='text-gray-700 [&_td]:font-light [&>tr>td]:py-2.5'>
                            {usersList?.map((user: any) => (
                                <tr key={user.id} className='border-b border-gray-300'>

                                    <td className='px-2.5 truncate'>{user.username}</td>
                                    <td className='pr-2.5 truncate'>{user.full_name}</td>
                                    <td className='pr-2.5 truncate'>{user.email}</td>
                                    <td className=''>{user.phone}</td>
                                    <td>{user.role_name}</td>
                                    <td className=''>
                                        <div className=''>
                                            <ActiveSwitch checked={user.is_active} onChange={(isChecked: any) => handleUpdateStatus(user.id, isChecked)} activeText='' inactiveText='' />
                                        </div>
                                    </td>
                                    <td className=''>
                                        <div className="flex items-center justify-center gap-x-4">
                                            <button
                                                onClick={() => setUserDetailPopupOpen(user)}
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
            {addUserPopupOpen && <AddUserPopup onClose={() => setAddUserPopupOpen(false)} mutate={mutate} />}
            {userDetailPopupOpen && <UserDetailPopup user={userDetailPopupOpen} onClose={() => setUserDetailPopupOpen(null)} mutate={mutate} />}
        </div>
    )
}

interface AddUserPopupProps {
    onClose: () => void;
    mutate: () => void;
}

export const AddUserPopup: FC<AddUserPopupProps> = ({ onClose, mutate }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, []);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedRole, setSelectedRole] = useState<{ value: number, label: string } | null>(null);
    const [selectedPrefix, setSelectedPrefix] = useState<{ value: number, label: string } | null>(null);
    const roleOptions = [
        { value: 2, label: 'เจ้าหน้าที่' },
        { value: 3, label: 'ผู้ใช้งาน' }
    ];

    const prefixOptions = [
        { value: 1, label: 'นาย' },
        { value: 2, label: 'นาง' },
        { value: 3, label: 'นางสาว' }
    ];
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedPrefix && selectedRole && firstName && lastName && email && username && password && phone) {
                const confirmResult = await Swal.fire({
                    title: 'ยืนยันการเพิ่มเจ้าหน้าที่',
                    icon: 'question',
                    confirmButtonText: 'ยืนยัน',
                    confirmButtonColor: '#3085d6',
                    showCancelButton: true,
                    cancelButtonColor: '#6B7280',
                    cancelButtonText: 'ยกเลิก'
                });
                if (!confirmResult.isConfirmed) return;
            }
            const response = await axios.post('/api/admin/manage-user', {
                role_id: selectedRole ? selectedRole.value : null,
                prefix_id: selectedPrefix ? selectedPrefix.value : null,
                username,
                password,
                first_name: firstName,
                last_name: lastName,
                email,
                phone
            });
            Swal.fire({
                icon: 'success',
                title: 'เพิ่มเจ้าหน้าที่สำเร็จ',
                confirmButtonText: 'ตกลง'
            });
            onClose();
            mutate();
        } catch (error: unknown) {
            console.error('Add User error:', error);
            if (axios.isAxiosError(error) && error.response) {
                console.error('Add User error response:', error.response.data);
                Swal.fire({
                    icon: 'error',
                    title: 'เพิ่มเจ้าหน้าที่ไม่สำเร็จ',
                    text: error.response.data.error.message || 'เกิดข้อผิดพลาดในการเพิ่มเจ้าหน้าที่',
                    confirmButtonText: 'ตกลง'
                });
                return;
            }
        }
    }
    return (
        <div id="admin-add-user-popup-component">
            <div className="px-4 md:px-0 fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-150 max-w-180 w-full bg-white rounded-[5px] py-4 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-4 pb-4 mb-4'>
                        <div className='flex items-center gap-x-4'>
                            <h2 className=' font-normal text-gray-800'>เพิ่มเจ้าหน้าที่ใหม่</h2>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-4 font-light tracking-wide'>
                        <form action="" onSubmit={handleSubmit} className='space-y-4'>
                            <div className='mb-4'>
                                <h2 className='text-gray-600 text-xs mb-2'>ข้อมูลส่วนตัว</h2>
                                <div className='grid grid-cols-[1fr_1.5fr_1.5fr] gap-x-4 border-b border-gray-300 pb-4'>
                                    <div className='flex flex-col space-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="">คำนำหน้า</label>
                                        <Select
                                            options={prefixOptions}
                                            onChange={setSelectedPrefix}
                                        />
                                    </div>
                                    <div className='flex flex-col space-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="">ชื่อจริง</label>
                                        <input name='' onChange={(e) => setFirstName(e.target.value)} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" autoFocus />
                                    </div>
                                    <div className='flex flex-col space-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="">นามสกุล</label>
                                        <input name='' onChange={(e) => setLastName(e.target.value)} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" />
                                    </div>
                                </div>
                            </div>
                            <div className='mb-4'>
                                <h2 className='text-gray-600 text-xs mb-2'>ข้อมูลติดต่อ</h2>
                                <div className='grid grid-cols-2 gap-x-4 border-b border-gray-300 pb-4'>
                                    <div className='flex flex-col space-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="">อีเมล</label>
                                        <input name='' onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type='email' />
                                    </div>
                                    <div className='flex flex-col space-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="">เบอร์โทรศัพท์</label>
                                        <input name='' onChange={(e) => setPhone(e.target.value)} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" />
                                    </div>
                                </div>
                            </div>
                            <div className='mb-4'>
                                <h2 className='text-gray-600 text-xs mb-2'>บัญชีผู้ใช้</h2>
                                <div className='grid grid-cols-[1fr_1.5fr_1.5fr] gap-x-4 border-b border-gray-300 pb-4'>
                                    <div className='flex flex-col space-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="">บทบาท</label>
                                        <Select
                                            options={roleOptions}
                                            onChange={setSelectedRole}
                                        />
                                    </div>
                                    <div className='flex flex-col space-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="">ชื่อผู้ใช้</label>
                                        <input onChange={(e) => setUsername(e.target.value)} name='' className="w-full border border-gray-300 hover:border-gray-500  px-4 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type='text' />
                                    </div>
                                    <div className='flex flex-col space-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="">รหัสผ่าน</label>
                                        <input name='' onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" />
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-end gap-x-4'>
                                <button onClick={onClose} type='button' className='text-sm  cursor-pointer rounded shadow px-5 py-2 bg-white text-gray-700 font-light border border-gray-300 duration-200 hover:bg-gray-100'>ยกเลิก</button>
                                <button type='submit' className='text-sm  cursor-pointer rounded px-5 py-2 bg-black text-white font-light duration-200 hover:opacity-80 '>บันทึกข้อมูล</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface UserDetailPopupProps extends AddUserPopupProps {
    user: any;
}

export const UserDetailPopup: FC<UserDetailPopupProps> = ({ user, onClose, mutate }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, []);
    const [isEditMode, setIsEditMode] = useState(false);
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [firstName, setFirstName] = useState(user.first_name);
    const [lastName, setLastName] = useState(user.last_name);
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<any>({ value: user.role_id, label: user.role_name });
    const [selectedPrefix, setSelectedPrefix] = useState<any>({ value: user.prefix_id, label: user.prefix_name });
    const roleOptions = [
        { value: 2, label: 'Staff' },
        { value: 3, label: 'User' }
    ];

    const prefixOptions = [
        { value: 1, label: 'นาย' },
        { value: 2, label: 'นาง' },
        { value: 3, label: 'นางสาว' }
    ];
    const handleSaveChange = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedPrefix && selectedRole && firstName && lastName && email && username && phone) {
                const confirmResult = await Swal.fire({
                    title: 'ยืนยันการอัปเดตผู้ใช้',
                    icon: 'question',
                    confirmButtonText: 'ยืนยัน',
                    confirmButtonColor: '#3085d6',
                    showCancelButton: true,
                    cancelButtonColor: '#6B7280',
                    cancelButtonText: 'ยกเลิก'
                });
                if (!confirmResult.isConfirmed) return;
            }
            const response = await axios.put(`/api/admin/manage-user/${user.id}`, {
                role_id: selectedRole ? selectedRole.value : null,
                prefix_id: selectedPrefix ? selectedPrefix.value : null,
                username,
                password: password || undefined,
                first_name: firstName,
                last_name: lastName,
                email,
                phone,
                is_active: user.is_active
            });
            Swal.fire({
                icon: 'success',
                title: response.data.message || 'อัปเดตผู้ใช้สำเร็จ',
                confirmButtonText: 'ตกลง'
            });
            setIsEditMode(false);
            mutate();
            onClose();
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Update user error response:', error.response?.data?.error);
                Swal.fire({
                    icon: 'error',
                    title: 'อัปเดตผู้ใช้ไม่สำเร็จ',
                    text: error.response?.data?.error?.message || 'เกิดข้อผิดพลาดในการอัปเดตผู้ใช้',
                    confirmButtonText: 'ตกลง'
                });
                return;
            }
            console.error('Update user error:', error);
        }
    }
    const handleDeleteUser = async (userId: number) => {
        try {
            const confirmResult = await Swal.fire({
                title: 'ยืนยันการลบผู้ใช้',
                text: `คุณต้องการลบผู้ใช้ ${user.full_name} นี้หรือไม่?`,
                icon: 'warning',
                confirmButtonText: 'ยืนยัน',
                confirmButtonColor: '#d33',
                showCancelButton: true,
                cancelButtonColor: '#6B7280',
                cancelButtonText: 'ยกเลิก'
            });
            if (!confirmResult.isConfirmed) return;
            const response = await axios.delete(`/api/admin/manage-user/${userId}`);
            Swal.fire({
                icon: 'success',
                title: response.data.message || 'ลบผู้ใช้สำเร็จ',
                confirmButtonText: 'ตกลง'
            });
            mutate();
            onClose();
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Delete User error response:', error.response.data);
                Swal.fire({
                    icon: 'error',
                    title: 'ลบผู้ใช้ไม่สำเร็จ',
                    text: error.response.data.error.message || 'เกิดข้อผิดพลาดในการลบผู้ใช้',
                    confirmButtonText: 'ตกลง'
                })
                return;
            }
            console.error('Delete User error:', error);
        }
    }
    return (
        <div id="admin-user-detail-popup-component">
            <div className="px-4 md:px-0 fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-130 max-w-150 w-full bg-white rounded-[5px] py-4 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-4 pb-4 mb-4'>
                        <div className='flex items-center gap-x-4'>
                            <h2 className=' font-normal text-gray-800'>{user.role_name === 'staff' ? 'รายละเอียดเจ้าหน้าที่' : 'รายละเอียดผู้ใช้งาน'}</h2>
                            {isEditMode && (
                                <p className={`rounded-full w-fit text-xs px-4 py-1 border text-yellow-700 bg-yellow-100  border-yellow-400`} >โหมดแก้ไข</p>
                            )}
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-4 font-light tracking-wide'>
                        <form action="" onSubmit={handleSaveChange}>
                            <div className='flex items-start justify-between mb-5'>
                                <div className='flex gap-x-4'>
                                    <div className='relative size-20 rounded-full border border-gray-300 overflow-hidden shadow'>
                                        <div className='bg-gray-100 size-full absolute flex flex-col justify-center items-center space-y-4'>
                                            <PiUser size={30} className=' text-gray-400 ' />
                                        </div>
                                    </div>
                                    {!isEditMode ? (
                                        <div className='space-y-1'>
                                            <div className='flex items-center gap-x-2 mb-2'>
                                                <p className={`rounded-full w-fit text-xs px-4 py-0.5 border ${user.is_active ? 'text-green-700 bg-green-200  border-green-500' : 'text-red-700 bg-red-200  border-red-500'}`} >{user.is_active ? 'Active' : 'Inactive'}</p>
                                                <p className={`rounded-full w-fit text-xs px-4 py-0.5 text-white bg-black`} >{user.role_name === 'staff' ? 'Staff' : 'User'}</p>
                                            </div>
                                            <div className='flex items-center font-normal text-gray-800'>
                                                <p>{user.prefix_name}</p>
                                                <p>{user.full_name}</p>
                                            </div>
                                            <div>
                                                <p className='text-sm text-gray-500'>@{user.username}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className='flex items-center gap-x-2 mb-2'>
                                                <p className={`rounded-full w-fit text-xs px-4 py-0.5 border ${user.is_active ? 'text-green-700 bg-green-200  border-green-500' : 'text-red-700 bg-red-200  border-red-500'}`} >{user.is_active ? 'Active' : 'Inactive'}</p>
                                                <p className={`rounded-full w-fit text-xs px-4 py-0.5 text-white bg-black`} >{user.role_name === 'staff' ? 'Staff' : 'User'}</p>
                                            </div>
                                            <div className='flex items-start gap-x-4'>
                                                <div className='flex flex-col space-y-2'>
                                                    <label className='text-xs text-gray-500' htmlFor="">ชื่อจริง</label>
                                                    <input name='' value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full text-sm border border-gray-300 hover:border-gray-500  px-3 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" />
                                                </div>
                                                <div className='flex flex-col space-y-2'>
                                                    <label className='text-xs text-gray-500' htmlFor="">นามสกุล</label>
                                                    <input name='' value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full text-sm border border-gray-300 hover:border-gray-500  px-3 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {!isEditMode && (
                                    <div className='flex items-center gap-x-4'>
                                        <button
                                            onClick={() => setIsEditMode(true)}
                                            type='button'
                                            className="cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:border-gray-500 hover:shadow-[0px_0px_10px_#00000014]"
                                        >
                                            <CiEdit className="text-gray-600" size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            type='button'
                                            className="cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:border-gray-500 hover:shadow-[0px_0px_10px_#00000014]"
                                        >
                                            <PiTrashLight className="text-gray-600" size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className='space-y-2 border-b border-gray-300 pb-5 mb-5'>
                                <div className='flex items-center gap-x-2'>
                                    <p className='text-xs text-gray-500'>ใช้งานล่าสุด :</p>
                                    <p className='text-xs text-gray-900'>{user.last_login ? (formatThaiDate(user.last_login)) : 'ยังไม่เคยเข้าสู่ระบบ'}</p>
                                </div>
                                <div className='flex items-center gap-x-2'>
                                    <p className='text-xs text-gray-500'>วันที่สร้าง :</p>
                                    <p className='text-xs text-gray-900'>{user.created_at ? (formatThaiDate(user.created_at)) : 'ยังไม่เคยเข้าสู่ระบบ'}</p>
                                </div>
                            </div>
                            <div className='grid grid-cols-2 gap-x-3 mb-5'>
                                <div>
                                    {!isEditMode ? (
                                        <div className='space-y-3'>
                                            <div className='border border-gray-300 bg-gray-50 px-3 py-2 space-y-1'>
                                                <p className='text-xs text-gray-500'>บัญชีผู้ใช้</p>
                                                <p className='text-sm text-gray-900'>{user.username}</p>
                                            </div>
                                            <div className='border border-gray-300 bg-gray-50 px-3 py-2 space-y-1'>
                                                <p className='text-xs text-gray-500'>รหัสผ่าน</p>
                                                <p className='text-sm text-gray-900'>{user.password ? '********' : ''}</p>
                                            </div>
                                            <div className='border border-gray-300 bg-gray-50 px-3 py-2 space-y-1'>
                                                <p className='text-xs text-gray-500'>บทบาท</p>
                                                <p className='text-sm text-gray-900'>{user.role_name ? 'Staff' : 'User'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='space-y-3'>
                                            <div className='flex flex-col space-y-2 border border-gray-300 bg-gray-50 px-3 py-2'>
                                                <label className='text-xs text-gray-500' htmlFor="">บัญชีผู้ใช้</label>
                                                <input name='' value={username} onChange={(e) => setUsername(e.target.value)} className="w-full text-sm border border-gray-300 hover:border-gray-500  px-3 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" />
                                            </div>
                                            <div className='flex flex-col space-y-2 border border-gray-300 bg-gray-50 px-3 py-2'>
                                                <label className='text-xs text-gray-500' htmlFor="">รหัสผ่าน</label>
                                                <input name='' value={password} onChange={(e) => setPassword(e.target.value)} className="w-full text-sm border border-gray-300 hover:border-gray-500  px-3 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" />
                                            </div>
                                            <div className='flex flex-col space-y-2 border border-gray-300 bg-gray-50 px-3 py-2'>
                                                <label className='text-xs text-gray-500' htmlFor="">บทบาท</label>
                                                <Select
                                                    value={selectedRole}
                                                    options={roleOptions}
                                                    onChange={setSelectedRole}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {!isEditMode ? (
                                        <div className='space-y-3'>
                                            <div className='border border-gray-300 bg-gray-50 px-3 py-2 space-y-1'>
                                                <p className='text-xs text-gray-500'>อีเมล</p>
                                                <p className='text-sm text-gray-900'>{user.email}</p>
                                            </div>
                                            <div className='border border-gray-300 bg-gray-50 px-3 py-2 space-y-1'>
                                                <p className='text-xs text-gray-500'>เบอร์โทรศัพท์</p>
                                                <p className='text-sm text-gray-900'>{user.phone}</p>
                                            </div>
                                            <div className='border border-gray-300 bg-gray-50 px-3 py-2 space-y-1'>
                                                <p className='text-xs text-gray-500'>คำนำหน้า</p>
                                                <p className='text-sm text-gray-900'>{user.prefix_name}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='space-y-3'>
                                            <div className='flex flex-col space-y-2 border border-gray-300 bg-gray-50 px-3 py-2'>
                                                <label className='text-xs text-gray-500' htmlFor="">อีเมล</label>
                                                <input name='' value={email} onChange={(e) => setEmail(e.target.value)} className="w-full text-sm border border-gray-300 hover:border-gray-500  px-3 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" />
                                            </div>
                                            <div className='flex flex-col space-y-2 border border-gray-300 bg-gray-50 px-3 py-2'>
                                                <label className='text-xs text-gray-500' htmlFor="">เบอร์โทรศัพท์</label>
                                                <input name='' value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full text-sm border border-gray-300 hover:border-gray-500  px-3 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" />
                                            </div>
                                            <div className='flex flex-col space-y-2 border border-gray-300 bg-gray-50 px-3 py-2'>
                                                <label className='text-xs text-gray-500' htmlFor="">คำนำหน้า</label>
                                                <Select
                                                    value={selectedPrefix}
                                                    options={prefixOptions}
                                                    onChange={setSelectedPrefix}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-x-2'>
                                    <p className='text-xs text-gray-500'>อัปเดตล่าสุด :</p>
                                    <p className='text-xs text-gray-900'>{user.updated_at ? (formatThaiDate(user.updated_at)) : 'ยังไม่เคยอัปเดต'}</p>
                                </div>
                                {!isEditMode ? (
                                    <button onClick={onClose} type='button' className='text-sm  cursor-pointer rounded shadow px-5 py-2 bg-white text-gray-700 font-light border border-gray-300 duration-200 hover:bg-gray-100'>ปิด</button>
                                ) : (
                                    <div className='flex items-center gap-x-4'>
                                        <button onClick={() => setIsEditMode(false)} type='button' className='text-sm  cursor-pointer rounded shadow px-5 py-2 bg-white text-gray-700 font-light border border-gray-300 duration-200 hover:bg-gray-100'>ยกเลิก</button>
                                        <button type='submit' className='text-sm  cursor-pointer rounded px-5 py-2 bg-black text-white font-light duration-200 hover:opacity-80 '>บันทึก</button>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
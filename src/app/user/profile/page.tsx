'use client';
import React, { useState, useEffect } from 'react';
import { GoCalendar } from 'react-icons/go';
import { DateTime } from 'luxon';
import { LuUser } from 'react-icons/lu';
import { MdOutlineEmail, MdOutlinePhone } from 'react-icons/md';
import { SlPencil } from 'react-icons/sl';
import useSWR from 'swr';
import axios from 'axios';
import Select from 'react-select';
import Swal from 'sweetalert2';

const mockUser = {
    id: 3,
    username: 'Somguy',
    email: 'user@gmail.com',
    prefix_id: 1,
    prefix_name: 'นาย',
    first_name: 'สมกาย',
    last_name: 'สมเท่',
    phone: '0812345678',
    created_at: '2025-12-16T07:00:06.851Z',
};

const formatThaiDate = (dateString: string) => {
    if (!dateString) return '';
    return DateTime.fromISO(dateString)
        .plus({ hours: 7 })
        .setLocale('th')
        .toFormat('d LLLL yyyy');
};

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function Page() {

    const [isEditing, setIsEditing] = useState(false);

    const { data: userData, error: userError, isLoading: userLoading, mutate } = useSWR('/api/user/profile', fetcher,
        { onError: (err) => console.error('Error fetching user profile:', err) }
    );
    const prefixOptions = [
        { value: 1, label: 'นาย' },
        { value: 2, label: 'นาง' },
        { value: 3, label: 'นางสาว' },
    ];

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedPrefix, setSelectedPrefix] = useState<{ value: number; label: string } | null>(null);

    const handleEditMode = () => {
        if (!isEditing && userData) {
            setUsername(userData.username);
            setFirstName(userData.first_name);
            setLastName(userData.last_name);
            setPhone(userData.phone);
            setSelectedPrefix(prefixOptions.find(option => option.value === userData.prefix_id) || null);
        }
        setIsEditing(!isEditing);
    }

    const handleSubmit = async () => {
        try {
            if (username && firstName && lastName && phone && selectedPrefix) {
                const confirmResult = await Swal.fire({
                    title: 'ยืนยันการแก้ไขข้อมูล?',
                    icon: 'question',
                    confirmButtonText: 'ยืนยัน',
                    confirmButtonColor: '#3085d6',
                    showCancelButton: true,
                    cancelButtonColor: '#6B7280',
                    cancelButtonText: 'ยกเลิก'
                });
                if (!confirmResult.isConfirmed) return;
            }
            const response = await axios.put('/api/user/profile', {
                username,
                first_name: firstName,
                last_name: lastName,
                phone,
                prefix_id: selectedPrefix ? selectedPrefix.value : ''
            });
            Swal.fire({
                icon: 'success',
                title: 'แก้ไขข้อมูลสำเร็จ',
                confirmButtonText: 'ตกลง'
            });
            setIsEditing(false);
            mutate();
        } catch (error: unknown) {
            console.error('Error updating user profile:', error);
            if (axios.isAxiosError(error) && error.response) {
                console.error('Update User error response:', error.response.data);
                Swal.fire({
                    icon: 'error',
                    title: 'แก้ไขข้อมูลไม่สำเร็จ',
                    text: error.response.data.error.message || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล',
                    confirmButtonText: 'ตกลง'
                });
                return;
            }
        }
    }

    return (
        <div id="user-profile-page" className="my-20 max-w-250 mx-auto">
            <div className="mb-10">
                <div className="flex items-center gap-x-3 mb-2">
                    <h1 className="text-gray-800 text-3xl font-light">โปรไฟล์ผู้ใช้งาน</h1>
                    <div className="mt-1 w-12 h-0.75 bg-gray-600"></div>
                </div>
                <p className="font-light text-gray-500">ดูและแก้ไขข้อมูลส่วนตัวของคุณได้ที่นี่</p>
            </div>

            <div className="space-y-6 tracking-wide mb-10">
                {/* Avatar + ชื่อ */}
                <div className="border border-gray-300 shadow-md">
                    <div className="flex justify-between items-center border-b border-gray-300 p-4">
                        <div className="flex items-center gap-x-3">
                            <LuUser size={16} className="text-gray-500" />
                            <h2 className="font-light text-gray-800">ข้อมูลบัญชี</h2>
                        </div>
                        <button
                            onClick={handleEditMode}
                            className="cursor-pointer flex items-center gap-x-2 font-light text-gray-800 px-4 py-2 text-sm rounded border border-gray-300 transition-all duration-100 hover:bg-gray-100"
                        >
                            <SlPencil size={13} />
                            <p>{isEditing ? 'ยกเลิก' : 'แก้ไขข้อมูล'}</p>
                        </button>
                    </div>

                    <div className="p-6 flex items-center gap-x-6 border-b border-gray-300">
                        <div className="size-20 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center shrink-0">
                            <span className="text-2xl font-light text-gray-600">
                                {userData?.first_name.charAt(0)}
                            </span>
                        </div>
                        <div className='space-y-1'>
                            <p className="text-gray-900 font-normal text-lg">
                                {userData?.prefix_name} {userData?.first_name} {userData?.last_name}
                            </p>
                            <p className="text-sm font-light text-gray-500">@{userData?.username}</p>
                            <div className="flex items-center gap-x-2 mt-1">
                                <GoCalendar size={13} className="text-gray-400" />
                                <p className="text-xs font-light text-gray-400">
                                    สมาชิกตั้งแต่ {formatThaiDate(userData?.created_at)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ฟอร์มข้อมูล */}
                    <div className='p-6 grid grid-cols-2 gap-x-8 gap-y-5'>
                        <div>
                            <label className='text-xs text-gray-500 font-light' htmlFor="">คำนำหน้า</label>
                            {!isEditing ? (
                                <p className='text-sm text-gray-700 font-light'>{userData?.prefix_name}</p>
                            ) : (
                                <Select
                                    options={prefixOptions}
                                    value={selectedPrefix}
                                    onChange={setSelectedPrefix}
                                    className='font-light text-sm mt-3'
                                />
                            )}
                        </div>
                        <div>
                            <label className='text-xs text-gray-500 font-light' htmlFor="">ชื่อผู้ใช้งาน</label>
                            {!isEditing ? (
                                <p className='text-sm text-gray-700 font-light'>{userData?.username}</p>
                            ) : (
                                <input
                                    value={username}
                                    type="text"
                                    className='w-full border border-gray-300 hover:border-gray-500 text-sm px-4 py-1.5 mt-3 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none'
                                    onChange={e => setUsername(e.target.value)}
                                />
                            )}
                        </div>
                        <div>
                            <label className='text-xs text-gray-500 font-light' htmlFor="">ชื่อจริง</label>
                            {!isEditing ? (
                                <p className='text-sm text-gray-700 font-light'>{userData?.first_name}</p>
                            ) : (
                                <input
                                    value={firstName}
                                    type="text"
                                    className='w-full border border-gray-300 hover:border-gray-500 text-sm px-4 py-1.5 mt-3 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none'
                                    onChange={e => setFirstName(e.target.value)}
                                />
                            )}
                        </div>
                        <div>
                            <label className='text-xs text-gray-500 font-light' htmlFor="">นามสกุล</label>
                            {!isEditing ? (
                                <p className='text-sm text-gray-700 font-light'>{userData?.last_name}</p>
                            ) : (
                                <input
                                    value={lastName}
                                    type="text"
                                    className='w-full border border-gray-300 hover:border-gray-500 text-sm px-4 py-1.5 mt-3 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none'
                                    onChange={e => setLastName(e.target.value)}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* ข้อมูลติดต่อ */}
                <div className="border border-gray-300 shadow-md">
                    <div className="flex items-center gap-x-3 border-b border-gray-300 p-4">
                        <MdOutlineEmail size={16} className="text-gray-500" />
                        <h2 className="font-light text-gray-800">ข้อมูลติดต่อ</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                        <div>
                            <label className="block text-xs text-gray-500 font-light mb-1.5">
                                อีเมล
                            </label>
                            <div className="flex items-center gap-x-2 border border-gray-200 px-3 py-2 rounded bg-gray-100">
                                <MdOutlineEmail size={14} className="text-gray-400" />
                                <p className="text-sm font-light text-gray-700">{userData?.email}</p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 font-light mb-1.5">
                                เบอร์โทรศัพท์
                            </label>
                            {!isEditing ? (
                                <div className="flex items-center gap-x-2 py-2 rounded">
                                    <MdOutlinePhone size={14} className="text-gray-400" />
                                    <p className="text-sm font-light text-gray-700">{userData?.phone}</p>
                                </div>
                            ) : (
                                <div className="group flex items-center gap-x-2 border border-gray-300 hover:border-gray-500 px-3 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm">
                                    <MdOutlinePhone size={14} className="text-gray-400 group-focus-within:text-gray-800 duration-300" />
                                    <input value={phone} onChange={e => setPhone(e.target.value)} type="text" className='w-full hover:border-gray-500 text-sm duration-300  font-light text-gray-600 focus:outline-none' />
                                </div>
                            )}
                        </div>

                    </div>

                </div>
                {isEditing && (
                    <div className="flex justify-end gap-x-4">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="text-sm cursor-pointer rounded px-5 py-2 bg-white text-gray-700 font-light border border-gray-300 duration-200 hover:bg-gray-100"
                        >
                            ย้อนกลับ
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="text-sm cursor-pointer rounded px-5 py-2 bg-black text-white font-light duration-200 hover:opacity-80">
                            บันทึก
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
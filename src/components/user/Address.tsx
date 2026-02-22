'use client';
import React, { useState, useEffect, FC } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import useSWR from 'swr';
import { CiEdit } from "react-icons/ci";
import { PiTrashLight } from "react-icons/pi";
import { RxCross2 } from 'react-icons/rx';
import { AddressSkeleton } from './AddressSkeleton';
import { GoHome } from 'react-icons/go';
import { SiHomeadvisor } from 'react-icons/si';
import { ThailandAddressTypeahead, ThailandAddressValue, } from "react-thailand-address-typeahead";

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export const AddressList: FC = () => {
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
    const [thaiAddress, setThaiAddress] = useState<ThailandAddressValue>(
        ThailandAddressValue.empty()
    );

    const [editAddress, setEditAddress] = useState(null);
    const { data, error, isLoading, mutate } = useSWR('/api/user/address', fetcher,
        { onError: (err) => console.error(err) }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddress({
            ...address,
            [name]: value
        });
    }
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (address.first_name && address.last_name && address.street && address.phone && thaiAddress.subdistrict && thaiAddress.district && thaiAddress.province && thaiAddress.postalCode) {
                const confirmResult = await Swal.fire({
                    title: 'ยืนยันการเพิ่มที่อยู่ใหม่',
                    text: `คุณต้องการบันทึกการเปลี่ยนแปลงที่อยู่นี้หรือไม่?`,
                    icon: 'question',
                    confirmButtonText: 'ยืนยัน',
                    confirmButtonColor: '#3085d6',
                    showCancelButton: true,
                    cancelButtonColor: '#6B7280',
                    cancelButtonText: 'ยกเลิก'
                });
                if (!confirmResult.isConfirmed) return;
            }
            const addressData = {
                first_name: address.first_name,
                last_name: address.last_name,
                street: address.street,
                sub_district: thaiAddress.subdistrict,
                district: thaiAddress.district,
                province: thaiAddress.province,
                zip_code: thaiAddress.postalCode,
                phone: address.phone
            }
            await axios.post('/api/user/address', addressData);
            Swal.fire({
                title: 'สร้างที่อยู่ใหม่สำเร็จ',
                icon: 'success',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#3085d6'
            });
            setAddress({
                first_name: "",
                last_name: "",
                street: "",
                sub_district: "",
                district: "",
                province: "",
                zip_code: "",
                phone: ""
            })
            setThaiAddress(ThailandAddressValue.empty());
            mutate();
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Axios error creating address:', error.response?.data.error.message || error.message);
                Swal.fire({
                    title: 'ไม่สามารถเพิ่มที่อยู่ได้',
                    text: error.response?.data.error.message || 'เกิดข้อผิดพลาดในการเพิ่มที่อยู่',
                    icon: 'error',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#3085d6'
                });
                return;
            }
            console.error('Error creating address:', error);
        }
    }
    const handleDelete = async (addressId: string) => {
        try {
            const result = await Swal.fire({
                title: 'ยืนยันการลบที่อยู่',
                text: `คุณต้องการลบที่อยู่นี้หรือไม่?`,
                icon: 'warning',
                confirmButtonText: 'ยืนยัน',
                confirmButtonColor: '#d9534f',
                showCancelButton: true,
                cancelButtonColor: '#6B7280',
                cancelButtonText: 'ยกเลิก'
            });
            if (!result.isConfirmed) return;
            await axios.delete(`/api/user/address/${addressId}`);
            Swal.fire({
                title: 'ลบที่อยู่สำเร็จ',
                text: 'ที่อยู่ของคุณถูกลบเรียบร้อยแล้ว',
                icon: 'success',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#3085d6'
            });
            mutate();
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Axios error deleting address:', error.response?.data.error.message || error.message);
            }
            console.error('Error deleting address:', error);
        }
    }
    return (
        <div id="user-address-component" className='my-20 max-w-250 mx-auto'>
            <div className='flex justify-center gap-x-15 tracking-wide'>
                <div>
                    <div className='mb-10'>
                        <div className="flex items-center gap-x-3 mb-2">
                            <h1 className="text-gray-800 text-3xl font-light">ที่อยู่ของฉัน</h1>
                            <div className="mt-1 w-12 h-0.75 bg-gray-600"></div>
                        </div>
                        <p className='font-light text-gray-500'>ดูและจัดการที่อยู่จัดส่งของคุณได้ที่นี่</p>
                    </div>
                    <div>
                        {isLoading ? (
                            <div className='border-y border-l border-gray-300 py-4 pl-4'>
                                <AddressSkeleton loop={3} />
                            </div>
                        ) : data?.length === 0 ? (
                            <div className='h-full mt-30 w-105 flex flex-col items-center  justify-center tracking-wide '>
                                <div className='mb-5'>
                                    <SiHomeadvisor className="text-gray-200" size={50} />
                                </div>
                                <div className='flex items-center flex-col justify-center space-y-2 mb-6'>
                                    <p className='text-sm font-light text-gray-600'>คุณยังไม่ได้เพิ่มที่อยู่จัดส่งใดๆ</p>
                                </div>
                            </div>
                        ) : (
                            <div className='border-y border-l border-gray-300 py-4 pl-4'>
                                <div className='space-y-5 h-95.5 overflow-y-auto pr-4'>
                                    {data?.map((address: any) => (
                                        <div key={address.id} className='cursor-default border border-gray-300 p-4 shadow-sm rounded transition-all duration-100 hover:bg-gray-100 hover:border-gray-400'>
                                            <div>
                                                <div className='text-gray-900 font-light text-md mb-3 flex items-center justify-between gap-x-4'>
                                                    <span className='line-clamp-1'>{address.first_name} {address.last_name} </span>
                                                    <div className='flex items-center gap-x-3'>
                                                        <CiEdit onClick={() => setEditAddress(address)} className=' text-gray-700 transition-all duration-300 hover:scale-110 hover:text-gray-900 cursor-pointer' size={22} />
                                                        <PiTrashLight onClick={() => handleDelete(address.id)} className=' text-gray-700 transition-all duration-300 hover:scale-110 hover:text-gray-900 cursor-pointer' size={22} />
                                                    </div>
                                                </div>
                                                <p className='text-sm text-gray-500 font-light mb-1'>(+66) {address.phone}</p>
                                                <p className='text-sm text-gray-500 font-light line-clamp-1'>{address.street}, {address.sub_district}, {address.district}, {address.province}, {address.zip_code}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <div className="mb-5">
                        <h1 className="text-xl text-gray-700 mb-5">เพิ่มที่อยู่จัดส่ง</h1>
                    </div>
                    <div>
                        <form action="" onSubmit={handleCreate} className='w-125 space-y-6'>
                            <div className='flex gap-x-4'>
                                <input name='first_name' value={address.first_name} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='ชื่อจริง' autoFocus />
                                <input name='last_name' value={address.last_name} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='นามสกุล' />
                            </div>
                            <div>
                                <input name='street' value={address.street} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type='text' placeholder='ที่อยู่ / ถนน / บ้านเลขที่' />
                            </div>
                            {/* <div className='flex gap-x-4'>
                                <input name='sub_district' value={address.sub_district} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='ตำบาล / แขวง' />
                                <input name='district' value={address.district} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='อำเภอ / เขต' />
                            </div>
                            <div className='flex gap-x-4'>
                                <input name='province' value={address.province} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='จังหวัด' />
                                <input name='zip_code' value={address.zip_code} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='รหัสไปรษณีย์' />
                            </div> */}
                            <div className='relative'>
                                <ThailandAddressTypeahead
                                    value={thaiAddress}
                                    onValueChange={(val) => setThaiAddress(val)}
                                >
                                    <div className='grid grid-cols-2 gap-4'>
                                        <ThailandAddressTypeahead.SubdistrictInput
                                            className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none"
                                            placeholder='ตำบล / แขวง'
                                        />
                                        <ThailandAddressTypeahead.DistrictInput
                                            className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none"
                                            placeholder='อำเภอ / เขต'
                                        />
                                        <ThailandAddressTypeahead.ProvinceInput
                                            className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none"
                                            placeholder='จังหวัด'
                                        />
                                        <ThailandAddressTypeahead.PostalCodeInput
                                            className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none"
                                            placeholder='รหัสไปรษณีย์'
                                        />
                                    </div>
                                    <ThailandAddressTypeahead.Suggestion
                                        containerProps={{
                                            className: "absolute z-50 w-[85%] mt-2 bg-white font-light text-sm text-gray-800 tracking-wide border-2 border-gray-400 cursor-pointer max-h-60 overflow-y-auto shadow-xl [&>*]:hover:bg-gray-100 [&>*]:p-2"
                                        }}
                                    />
                                </ThailandAddressTypeahead>
                            </div>
                            <div className='flex gap-x-4'>
                                <input name='phone' value={address.phone} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='เบอร์โทรศัพท์' />
                            </div>
                            <div
                                className=''>
                                <button
                                    type='submit'
                                    className={` bg-black w-full cursor-pointer  text-white font-light text-md py-2.5 transition-all duration-100 `}>บันทึกที่อยู่ใหม่</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {editAddress && <EditAddressPopup addressData={editAddress} onClose={() => setEditAddress(null)} mutate={mutate} />}
        </div >
    )
}

interface EditAddressPopupProps {
    addressData: any;
    onClose: () => void;
    mutate: () => void;
}

export const EditAddressPopup: FC<EditAddressPopupProps> = ({ addressData, onClose, mutate }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    const [address, setAddress] = useState({
        first_name: addressData.first_name,
        last_name: addressData.last_name,
        street: addressData.street,
        sub_district: addressData.sub_district,
        district: addressData.district,
        province: addressData.province,
        zip_code: addressData.zip_code,
        phone: addressData.phone
    });
    const [thaiAddress, setThaiAddress] = useState<ThailandAddressValue>(
        ThailandAddressValue.fromDatasourceItem({
            s: addressData.sub_district,
            d: addressData.district,
            p: addressData.province,
            po: addressData.zip_code
        })
    );
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddress({
            ...address,
            [name]: value
        });
    }
    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const addressId = addressData.id;
            if (address.first_name && address.last_name && address.street && thaiAddress.subdistrict && thaiAddress.district && thaiAddress.province && thaiAddress.postalCode && address.phone) {
                const confirmResult = await Swal.fire({
                    title: 'ยืนยันการแก้ไขที่อยู่',
                    text: `คุณต้องการบันทึกการเปลี่ยนแปลงที่อยู่นี้หรือไม่?`,
                    icon: 'question',
                    confirmButtonText: 'ยืนยัน',
                    confirmButtonColor: '#3085d6',
                    showCancelButton: true,
                    cancelButtonColor: '#6B7280',
                    cancelButtonText: 'ยกเลิก'
                });
                if (!confirmResult.isConfirmed) return;
            }
            const addressForAPI = {
                first_name: address.first_name,
                last_name: address.last_name,
                street: address.street,
                sub_district: thaiAddress.subdistrict,
                district: thaiAddress.district,
                province: thaiAddress.province,
                zip_code: thaiAddress.postalCode,
                phone: address.phone
            }
            await axios.put(`/api/user/address/${addressId}`, addressForAPI);
            Swal.fire({
                title: 'แก้ไขที่อยู่สำเร็จ',
                icon: 'success',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#3085d6'
            });
            mutate();
            onClose();
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Axios error editing address:', error.response?.data.error.message || error.message);
                Swal.fire({
                    title: 'ไม่สามารถแก้ไขที่อยู่ได้',
                    text: error.response?.data.error.message || 'เกิดข้อผิดพลาดในการแก้ไขที่อยู่',
                    icon: 'error',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#3085d6'
                });
                return;
            }
            console.error('Error editing address:', error);
        }
    }
    return (
        <div id="user-edit-address-popup-component">
            <div className="px-4 md:px-0 fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-75 max-w-150 w-full bg-white rounded-[5px] py-4 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-6 pb-4 mb-6'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className=' font-normal text-gray-800'>แก้ไขข้อมูลที่อยู่</h2>
                        </div>
                        <button className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 onClick={onClose} size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-6 font-light '>
                        <div>
                            <form action="" onSubmit={handleEdit} className=' space-y-6'>
                                <div className='grid grid-cols-2 gap-x-4'>
                                    <div className='flex flex-col space-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="first_name">ชื่อจริง</label>
                                        <input name='first_name' value={address.first_name} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='ชื่อจริง' />
                                    </div>
                                    <div className='flex flex-col space-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="last_name">นามสกุล</label>
                                        <input name='last_name' value={address.last_name} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='นามสกุล' />
                                    </div>
                                </div>
                                <div className='flex flex-col space-y-2'>
                                    <label className='text-sm text-gray-700' htmlFor="street">ที่อยู่ / ถนน / บ้านเลขที่</label>
                                    <input name='street' value={address.street} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type='text' placeholder='ที่อยู่ / ถนน / บ้านเลขที่' />
                                </div>
                                {/* <div className='grid grid-cols-2 gap-x-4'>
                                    <div className='flex flex-col space-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="sub_district">ตำบล / แขวง</label>
                                        <input name='sub_district' value={address.sub_district} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='ตำบาล / แขวง' />
                                    </div>
                                    <div className='flex flex-col space-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="district">อำเภอ / เขต</label>
                                        <input name='district' value={address.district} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='อำเภอ / เขต' />
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-x-4'>
                                    <div className='flex flex-col space-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="province">จังหวัด</label>
                                        <input name='province' value={address.province} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='จังหวัด' />
                                    </div>
                                    <div className='flex flex-col space-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="zip_code">รหัสไปรษณีย์</label>
                                        <input name='zip_code' value={address.zip_code} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='รหัสไปรษณีย์' />
                                    </div>
                                </div> */}
                                <div className='relative'>
                                    <ThailandAddressTypeahead
                                        value={thaiAddress}
                                        onValueChange={(val) => setThaiAddress(val)}
                                    >
                                        <div className='grid grid-cols-2 gap-4'>
                                            <div className='flex flex-col space-y-2'>
                                                <label className='text-sm text-gray-700' htmlFor="province">ตำบล / แขวง</label>
                                                <ThailandAddressTypeahead.SubdistrictInput
                                                    className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none"
                                                    placeholder='ตำบล / แขวง'
                                                />
                                            </div>
                                            <div className='flex flex-col space-y-2'>
                                                <label className='text-sm text-gray-700' htmlFor="province">อำเภอ / เขต</label>
                                                <ThailandAddressTypeahead.DistrictInput
                                                    className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none"
                                                    placeholder='อำเภอ / เขต'
                                                />
                                            </div>
                                            <div className='flex flex-col space-y-2'>
                                                <label className='text-sm text-gray-700' htmlFor="province">จังหวัด</label>
                                                <ThailandAddressTypeahead.ProvinceInput
                                                    className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none"
                                                    placeholder='จังหวัด'
                                                />
                                            </div>
                                            <div className='flex flex-col space-y-2'>
                                                <label className='text-sm text-gray-700' htmlFor="province">รหัสไปรษณีย์</label>
                                                <ThailandAddressTypeahead.PostalCodeInput
                                                    className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none"
                                                    placeholder='รหัสไปรษณีย์'
                                                />
                                            </div>
                                        </div>
                                        <ThailandAddressTypeahead.Suggestion
                                            containerProps={{
                                                className: "shadow-xl absolute z-50 w-[85%] mt-2 bg-white font-light text-sm text-gray-800 tracking-wide border-2 border-gray-400 cursor-pointer max-h-50 overflow-y-auto [&>*]:hover:bg-gray-100 [&>*]:p-2"
                                            }}
                                        />
                                    </ThailandAddressTypeahead>
                                </div>
                                <div className='grid grid-cols-1 '>
                                    <div className='flex flex-col space-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="phone">เบอร์โทรศัพท์</label>
                                        <input name='phone' value={address.phone} onChange={handleChange} className="w-full border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" placeholder='เบอร์โทรศัพท์' />
                                    </div>
                                </div>
                                <div
                                    className='flex justify-end items-center gap-x-4'>
                                    <button onClick={onClose} type='button' className='text-sm  cursor-pointer rounded px-5 py-2 bg-white text-gray-700 font-light border border-gray-300 duration-200 hover:bg-gray-100'>ยกเลิก</button>
                                    <button
                                        type='submit'
                                        className={` bg-black cursor-pointer  text-white font-light text-sm py-2 px-5 rounded transition-all duration-100 `}>บันทึก</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

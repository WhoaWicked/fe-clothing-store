'use client';
import React, { useState, useEffect, FC, useRef } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { RxCross2, RxReset } from 'react-icons/rx';
import Swal from 'sweetalert2';
import { GoCalendar, GoPlus, GoSearch } from 'react-icons/go';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import ActiveSwitch from '../input/ActiveSwitch';
import { FaLayerGroup } from 'react-icons/fa';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { BsFilterRight } from 'react-icons/bs';
import Select from 'react-select';
import { DateTime } from 'luxon';
import { PiTrashLight, PiUser } from 'react-icons/pi';
import { CiEdit } from 'react-icons/ci';
import DatePicker from 'react-datepicker';
import JsonView from '@uiw/react-json-view';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const formatThaiDate = (dateString: string) => {
    return DateTime.fromISO(dateString)
        .plus({ hours: 7 })
        .setLocale('th')
        .toFormat('d LLLL yyyy HH:mm');
};

export const ActivityLog: FC = () => {
    const sortMenuRef = React.useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [limitPerPage, setLimitPerPage] = useState(10);
    const [searchGlobal, setSearchGlobal] = useState('');
    const [searchGlobalDebounced, setSearchGlobalDebounced] = useState('');
    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const [sortType, setSortType] = useState('newest');
    const [selectedRole, setSelectedRole] = useState<{ value: string; label: string } | null>({ value: '', label: 'ทั้งหมด' });
    const [selectedAction, setSelectedAction] = useState<{ value: string; label: string } | null>({ value: '', label: 'ทั้งหมด' });
    const [selectedStatus, setSelectedStatus] = useState<{ value: string; label: string } | null>({ value: '', label: 'ทั้งหมด' });
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [startDate, endDate] = dateRange;
    const [openLogDetailModal, setOpenLogDetailModal] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchGlobal(searchGlobalDebounced);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchGlobalDebounced]);

    const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limitPerPage.toString(),
        search_global: searchGlobal.toString().trim(),
        sort_type: sortType.toString(),
        action: selectedAction?.value || '',
        role_name: selectedRole?.value || '',
        is_success: selectedStatus?.value || '',
        start_date: startDate?.toISOString() || '',
        end_date: endDate?.toISOString() || '',
    });
    const { data: logs, error: logError, isLoading: logLoading, mutate } = useSWR(`/api/admin/activity-log?${params.toString()}`, fetcher,
        { onError: (err) => { console.error('Error fetching activity logs:', err) } }
    );
    const logsList = logs?.logs || [];
    const totalPages = logs?.pagination?.totalPages || 1;
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    }

    // useEffect(() => {
    //     // eslint-disable-next-line react-hooks/set-state-in-effect
    //     setCurrentPage(1);
    // }, [selectedAction, selectedRole, selectedStatus, startDate, endDate]);
    const handleFilterChange = (setter: Function, value: any) => {
        setter(value);
        setCurrentPage(1);
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
    
    const handleReset = () => {
        setSearchGlobalDebounced('');
        setSelectedAction({ value: '', label: 'ทั้งหมด' });
        setSelectedRole({ value: '', label: 'ทั้งหมด' });
        setSelectedStatus({ value: '', label: 'ทั้งหมด' });
        setDateRange([null, null]);
        setSortType('newest');
        setCurrentPage(1);
    }
    return (
        <div id="admin-activity-log-list-component">
            <div>
                <h2 className='text-xl font-light text-gray-800 mb-4'>รายการบันทึกกิจกรรม</h2>
                <div className='flex items-end justify-between mb-5'>
                    <div className='flex flex-col gap-5'>
                        <div className='flex items-center gap-x-5'>
                            <div className="w-70 group flex items-center gap-x-4 border border-gray-300 hover:border-gray-500  px-4 py-2.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm">
                                <GoSearch className="text-gray-400 group-focus-within:text-gray-800 duration-300" size={20} />
                                <input value={searchGlobalDebounced} onChange={(e) => setSearchGlobalDebounced(e.target.value)} type="text" className="font-light text-sm w-full tracking-wide text-gray-600 focus:outline-none" placeholder="ค้นหาด้วย ชื่อ, อีเมล, ประเภท" />
                            </div>
                            <div className='group flex items-center gap-x-2 border border-gray-300 px-4 duration-300 hover:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm'>
                                <GoCalendar size={20} className='text-gray-400 group-focus-within:text-gray-800 duration-300' />
                                <DatePicker
                                    selectsRange
                                    dateFormat="dd/MM/yyyy"
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={(dates) => handleFilterChange(setDateRange, dates)}
                                    placeholderText='เลือก วัน / เดือน / ปี'
                                    className='text-sm px-4 py-2.5 font-light focus:outline-none text-gray-600'
                                />
                            </div>
                        </div>
                        <div className='flex items-center gap-x-5'>
                            <div className='flex flex-col space-y-1'>
                                <label className='text-xs text-gray-700 font-light' htmlFor="">ประเภท</label>
                                <Select
                                    className='font-light text-sm w-40 uppercase'
                                    placeholder="ประเภท"
                                    value={selectedAction}
                                    onChange={(value) => handleFilterChange(setSelectedAction, value)}
                                    options={[
                                        { value: '', label: 'ทั้งหมด' },
                                        { value: 'CREATE', label: 'Create' },
                                        { value: 'UPDATE', label: 'Update' },
                                        { value: 'DELETE', label: 'Delete' },
                                        { value: 'LOGIN', label: 'Login' },
                                        { value: 'ORDER', label: 'Order' },
                                    ]}
                                />
                            </div>
                            <div className='flex flex-col space-y-1'>
                                <label className='text-xs text-gray-700 font-light' htmlFor="">บทบาท</label>
                                <Select
                                    className='font-light text-sm w-40 uppercase'
                                    placeholder="บทบาท"
                                    value={selectedRole}
                                    onChange={(value) => handleFilterChange(setSelectedRole, value)}
                                    options={[
                                        { value: '', label: 'ทั้งหมด' },
                                        { value: 'user', label: 'USER' },
                                        { value: 'staff', label: 'STAFF' },
                                        { value: 'admin', label: 'ADMIN' },
                                    ]}
                                />
                            </div>
                            <div className='flex flex-col space-y-1'>
                                <label className='text-xs text-gray-700 font-light' htmlFor="">สถานะ</label>
                                <Select
                                    className='font-light text-sm w-40 uppercase'
                                    placeholder="สถานะ"
                                    value={selectedStatus}
                                    onChange={(value) => handleFilterChange(setSelectedStatus, value)}
                                    options={[
                                        { value: '', label: 'ทั้งหมด' },
                                        { value: 'true', label: 'SUCCESS' },
                                        { value: 'false', label: 'FAILED' }
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-x-5'>
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
                        <div onClick={handleReset} className='w-fit border border-gray-300 p-2.5 hover:border-gray-500 shadow-sm cursor-pointer transition-all duration-300 hover:scale-110'>
                            <RxReset  className="text-gray-600 duration-300" size={20} />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <table className='w-full text-sm text-left table-fixed'>
                    <thead className='text-gray-500 [&_th]:font-light bg-slate-50 border border-gray-300'>
                        <tr className=''>
                            <th className='px-2.5 py-2.5 w-[20%]'>วันเวลา</th>
                            <th className='w-[15%]'>ผู้ทำ</th>
                            <th className='w-[10%]'>บทบาท</th>
                            <th className='w-[20%]'>สิ่งที่ทำ</th>
                            <th className='w-[20%]'>ผลลัพธ์</th>
                            <th className='w-[10%]'>สถานะ</th>
                        </tr>
                    </thead>
                    <tbody className='text-gray-700 [&_td]:font-light [&>tr>td]:py-2.5'>
                        {logsList?.map((log: any) => (
                            <tr onClick={() => setOpenLogDetailModal(log)} key={log.log_id} className='border-b border-gray-300 transition-all duration-100 ease-out hover:bg-gray-100 active:bg-gray-200 cursor-pointer'>
                                <td className='px-2.5 truncate'>{formatThaiDate(log.created_at)}</td>
                                <td className='pr-2.5 truncate'>{log.current_full_name || 'Guest'}</td>
                                <td className='pr-2.5 truncate'>{log.snapshot_role}</td>
                                <td className='pr-2.5 truncate'>{log.action_type}</td>
                                <td className='pr-2.5 truncate'>{log.details?.message ? log.details.message : log.details.error}</td>
                                <td>{log.is_success ? 'สำเร็จ' : 'ล้มเหลว'}</td>
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
            {openLogDetailModal && <LogDetailModal log={openLogDetailModal} onClose={() => setOpenLogDetailModal(null)} mutate={mutate} />}
        </div>
    )
}

interface LogDetailModalProps {
    log: any;
    onClose: () => void;
    mutate: () => void;
}

export const LogDetailModal: FC<LogDetailModalProps> = ({ log, onClose, mutate }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, []);
    return (
        <div id="log-detail-modal-component">
            <div className="fixed inset-0 z-100 flex justify-end" aria-modal='true'>
                <div className='fixed inset-0 bg-black/30 backdrop-blur-[1px] transition-opacity duration-300 ease-out' onClick={onClose}>

                </div>
                <div className="tracking-wide w-[30vw] h-screen bg-white relative flex flex-col">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-4 py-5 mb-4'>
                        <div className=''>
                            <div className='flex flex-col'>
                                <h2 className=' font-normal text-gray-800'>รายละเอียดบันทึกกิจกรรม</h2>
                                <p className='font-light text-xs text-gray-500'>Log ID: {log.log_id}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-4 font-light tracking-wide overflow-y-auto'>
                        <div className='border border-gray-200 shadow-md p-5 mb-5 rounded'>
                            <div className='flex gap-x-4 mb-5'>
                                <div className='relative size-15 rounded-full overflow-hidden'>
                                    <div className='bg-gray-100 size-full absolute flex flex-col justify-center items-center space-y-4'>
                                        <PiUser size={25} className=' text-gray-400 ' />
                                    </div>
                                </div>
                                <div>
                                    <h2 className='text-2xl font-medium text-gray-800'>{log.current_full_name || log.resource_id}</h2>
                                    <p className='text-sm text-gray-500'>{log.current_email || log.resource_id}</p>
                                </div>
                            </div>
                            <div className='flex justify-between items-center'>
                                <p className='text-sm text-gray-500'>Role : {log.snapshot_role}</p>
                                <p className={`uppercase ${log.current_active_status ? 'text-green-600 bg-green-100 ' : 'text-red-600 bg-red-100'} text-sm font-medium w-fit px-3 py-1 rounded`}>{log.current_active_status ? 'Active User' : 'Inactive User'}</p>
                            </div>
                        </div>
                        <div className=''>
                            <p className='uppercase font-medium text-xs text-gray-400 mb-4'>Active Type</p>
                            <div className='flex items-center gap-x-4 mb-4'>
                                <p className='text-sm text-gray-600 font-medium bg-gray-100 w-fit px-3 py-1 rounded'>{log.action_type}</p>
                                <p className={`uppercase ${log.is_success ? 'text-green-600 bg-green-100 ' : 'text-red-600 bg-red-100'} text-sm font-medium w-fit px-3 py-1 rounded`}>{log.is_success ? 'Success' : 'Failed'}</p>
                                {log?.details?.status && (
                                    <p className={`uppercase ${'text-red-600 bg-red-100'} text-sm font-medium w-fit px-3 py-1 rounded`}>{log?.details?.status}</p>
                                )}
                            </div>
                            <div className='border-b border-gray-300 pb-4 mb-4'>
                                <p className='uppercase font-medium text-xs text-gray-400 mb-2'>Timestamp</p>
                                <p className='text-lg text-gray-800'>{formatThaiDate(log.created_at)}</p>
                            </div>
                            <div className='mb-4'>
                                <p className='uppercase font-medium text-xs text-gray-400 mb-4'>Message / Details</p>
                                <div className='border border-gray-300 rounded p-4'>
                                    <ul className='text-sm text-gray-800'>
                                        <li className=''>{log?.details?.message}</li>
                                        <li className=''>{log?.details?.error}</li>
                                    </ul>
                                </div>
                            </div>
                            <div className='mb-4'>
                                <div className='flex items-center gap-x-2 mb-4'>
                                    <p className='uppercase font-medium text-xs text-gray-400'>Technical Data</p>
                                    <p className='font-medium text-gray-500 text-xs bg-gray-200 w-fit px-2 py-1 rounded'>DEV ONLY</p>
                                </div>
                                <div className='border border-gray-300 rounded p-4'>
                                    <div className='overflow-x-auto'>
                                        <JsonView value={log?.details || {}}
                                            collapsed={1}              // ย่อเหลือ 1 ระดับ
                                            displayDataTypes={false}   // ซ่อน type    
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
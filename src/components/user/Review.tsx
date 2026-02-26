'use client';
import React, { useState, useEffect, FC, useRef } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BsStarFill } from "react-icons/bs";
import { BsStar } from "react-icons/bs";
import { PiUser } from 'react-icons/pi';
import { DateTime } from 'luxon';
import { GoCalendar } from 'react-icons/go';
import { BsFilterRight } from "react-icons/bs";
import { RxDotsVertical } from 'react-icons/rx';
import { FaComments } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useProfile } from '@/context/profileContext';
import { PiTrashLight } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { GoReport } from "react-icons/go";


const regexProductIdFromURL = (slug: string) => {
    if (!slug) return null;
    const match = slug.match(/^(\d+)-/);
    return match ? match[1] : null;
}

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const formatThaiDate = (dateString: string) => {
    return DateTime.fromISO(dateString)
        .plus({ hours: 7 })
        .setLocale('th')
        .toFormat('d LLLL yyyy HH:mm');
};

const StarRating: FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className='flex items-center gap-x-1'>
            {[1, 2, 3, 4, 5].map((star) =>
                star <= rating ? (
                    <BsStarFill key={star} size={16} className='text-yellow-400' />
                ) : (
                    <BsStar key={star} size={16} className='text-yellow-400' />
                )
            )}
        </div>
    )
}

const StarSelector: FC<{ rating: number; onSelect: (rating: number) => void }> = ({ rating, onSelect }) => {
    return (
        <div className='flex items-center gap-x-1'>
            {[1, 2, 3, 4, 5].map((star) =>
                star <= rating ? (
                    <BsStarFill onClick={() => onSelect(star)} key={star} size={25} className='text-yellow-400 cursor-pointer' />
                ) : (
                    <BsStar onClick={() => onSelect(star)} key={star} size={25} className='text-yellow-400 cursor-pointer' />
                )
            )}
        </div>
    )
}

export const ReviewList: FC = () => {
    const menuRef = useRef<HTMLDivElement | null>(null);
    const sortMenuRef = useRef<HTMLDivElement | null>(null);
    const { profileData } = useProfile();
    const params = useParams();
    const { slug } = params as { slug: string };
    const productId = regexProductIdFromURL(slug);
    const [toggleReviews, setToggleReviews] = useState<boolean>(false);
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [toggleForm, setToggleForm] = useState<boolean>(false);
    const [sortMenu, setSortMenu] = useState<boolean>(false);
    const [sortType, setSortType] = useState<string>('');
    const [activeReviewMenu, setActiveReviewMenu] = useState<number | null>(null);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/user/review', {
                productId,
                rating: selectedRating,
                comment: comment
            });
            setToggleForm(false);
            setSortType('');
            setComment('');
            setSelectedRating(0);
            mutate();
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error("Error submitting review:", error.response.data.error.message || error.response);
            }
        }
    }
    const handleDelete = async (reviewId: number) => {
        try {
            const confirmResult = await Swal.fire({
                title: 'ยืนยันการลบรีวิว',
                text: `คุณต้องการลบรีวิวนี้หรือไม่?`,
                icon: 'warning',
                confirmButtonText: 'ยืนยัน',
                confirmButtonColor: '#d9534f',
                showCancelButton: true,
                cancelButtonColor: '#6B7280',
                cancelButtonText: 'ยกเลิก'
            });
            if (!confirmResult.isConfirmed) return;
            const response = await axios.delete('/api/user/review', {
                params: { reviewId }
            });
            mutate();
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error("Error deleting review:", error.response.data.error.message || error.response);
            }
            console.error("Error deleting review:", error);
        }
    }
    const { data, error, isLoading, mutate } = useSWR(productId ? `/api/user/review?productId=${productId}&sortType=${sortType}` : null, fetcher,
        { onError: (err) => { console.error("Error fetching reviews:", err); } }
    );
    // ปิดเมนู sort เมื่อคลิกข้างนอก
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
                setSortMenu(false);
            }
        }
        if (sortMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sortMenu]);
    // ปิดเมนูเมื่อคลิกข้างนอก
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveReviewMenu(null);
            }
        }
        if (activeReviewMenu !== null) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeReviewMenu]);
    return (
        <div id='review-list-component' className='my-20'>
            <div className='tracking-wide'>
                <div className='flex items-center'>
                    <button onClick={() => setToggleReviews(false)} className={`${!toggleReviews && 'bg-gray-100'} cursor-pointer font-light text-gray-700 text-sm border border-gray-300 border-r-transparent border-b-transparent px-6 py-4 transition-all duration-300 ease-out hover:bg-gray-100`}>Description</button>
                    <button onClick={() => setToggleReviews(true)} className={`${toggleReviews && 'bg-gray-100'} cursor-pointer font-light text-gray-700 text-sm border border-gray-300 border-b-transparent px-6 py-4 transition-all duration-300 ease-out hover:bg-gray-100`}>Reviews ({data ? data.length : 0})</button>
                </div>
                <div className='border border-gray-300 p-8 pr-4 shadow-sm'>
                    {toggleReviews ? (
                        <div>
                            <div>
                                <div className='flex justify-between'>
                                    <div>
                                        <button onClick={() => setToggleForm(true)} className={`tracking-wide font-light text-sm cursor-pointer text-gray-700 border border-gray-300 shadow-sm hover:border-gray-500 hover:text-gray-900 px-5 py-3 disabled:opacity-50 disabled:cursor-default hover:scale-105 transition-all duaration-300`}>
                                            เพิ่มความคิดเห็น
                                        </button>
                                    </div>
                                    <div onClick={() => setSortMenu(!sortMenu)} className='relative flex items-center gap-x-2 cursor-pointer transition-all duration-500  w-fit '>
                                        <BsFilterRight size={20} className='text-gray-500' />
                                        <p className='font-light text-sm text-gray-500'>จัดเรียงตาม</p>
                                        {sortMenu && (
                                            <div ref={sortMenuRef} className='z-20 absolute right-8 top-8 bg-white pt-2'>
                                                <div className='border border-gray-300 w-35 shadow-sm'>
                                                    <ul className='font-light text-gray-900 text-sm tracking-wide'>
                                                        <li onClick={() => {
                                                            setSortType('newest');

                                                        }} className='hover:bg-gray-200 p-3 cursor-pointer'>ใหม่ล่าสุด</li>
                                                        <li onClick={() => {
                                                            setSortType('oldest');

                                                        }} className='hover:bg-gray-200 p-3 cursor-pointer'>เก่าที่สุด</li>
                                                        <li onClick={() => {
                                                            setSortType('highest');

                                                        }} className='hover:bg-gray-200 p-3 cursor-pointer'>คะแนนสูงสุด</li>
                                                        <li onClick={() => {
                                                            setSortType('lowest');

                                                        }} className='hover:bg-gray-200 p-3 cursor-pointer' >คะแนนต่ำสุด</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {toggleForm && (
                                    <div className='mt-5'>
                                        <form action="" onSubmit={handleSubmit}>
                                            <div className='flex items-center gap-x-4 mb-4'>
                                                <p className='font-light text-sm text-gray-600 '>คะแนนโดยรวม</p>
                                                <StarSelector rating={selectedRating} onSelect={setSelectedRating} />
                                            </div>
                                            <div className="group flex items-center gap-x-4 border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-md">
                                                <input value={comment} onChange={(e) => setComment(e.target.value)} type="text" className="font-light w-full tracking-wide text-gray-600 focus:outline-none" placeholder="เขียนรีวิวสินค้า" autoFocus />
                                            </div>
                                            <div className='flex justify-end gap-x-4 mt-5'>
                                                <button type='button' onClick={() => {
                                                    setToggleForm(false);
                                                    setComment('');
                                                    setSelectedRating(0);
                                                }} className='font-light text-sm text-black px-4 py-2 rounded-full cursor-pointer transition-all duration-300 hover:bg-gray-200'>ยกเลิก</button>
                                                <button disabled={!selectedRating || !comment} type='submit' className={`${selectedRating && comment ? 'bg-black cursor-pointer hover:opacity-75 text-white' : 'bg-gray-200 text-gray-500'} font-light text-sm  px-4 py-2 rounded-full transition-all duration-100 `}>ส่งความคิดเห็น</button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                            {isLoading ? (
                                <div className="h-115 flex flex-col items-center justify-center gap-4">
                                    <div className="size-15 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin">
                                    </div>
                                    {/* <p className="text-gray-500 text-sm">กำลังเข้าสู่ระบบ . . .</p> */}
                                </div>)
                                : data?.length === 0 ? (
                                    <div className='h-115 flex flex-col items-center mt-10 justify-center tracking-wide '>
                                        <div className='mb-5'>
                                            <FaComments className="text-gray-200" size={100} />
                                        </div>
                                        <div className='flex items-center flex-col justify-center space-y-2 mb-6'>
                                            <p className='text-sm font-light text-gray-600'>ยังไม่มีรีวิวสำหรับสินค้านี้</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='space-y-10 mt-10 h-115 max-h-115 overflow-y-auto pr-4'>
                                        {data?.map((review: any) => (
                                            <div className='' key={review.review_id}>
                                                <div className='flex justify-between mb-5'>
                                                    <div className='flex items-center gap-x-4'>
                                                        <div className='border border-gray-300 bg-slate-50 rounded-full p-2 w-fit'>
                                                            <PiUser className='text-gray-600' size={18} />
                                                        </div>
                                                        <div className='space-y-2'>
                                                            <div className='flex gap-x-4'>
                                                                <p className='font-medium text-sm text-gray-600'>{review.first_name} {review.last_name}</p>
                                                                <div className='flex items-center gap-x-2'>
                                                                    {/* <GoCalendar size={15} className='text-gray-500' /> */}
                                                                    <p className='text-xs font-light text-gray-500'>{formatThaiDate(review.created_at)}</p>
                                                                </div>
                                                            </div>
                                                            <div><StarRating rating={review.rating} /></div>
                                                        </div>
                                                    </div>
                                                    <div className='relative'>
                                                        <RxDotsVertical onClick={() => setActiveReviewMenu(review.review_id)} size={20} className='cursor-pointer text-gray-500' />
                                                        {activeReviewMenu === review.review_id && (
                                                            <div ref={menuRef} className='z-20 absolute right-2 top-7 bg-white pt-2'>
                                                                <div className='border border-gray-300 w-25 shadow-sm'>
                                                                    <ul className='font-light text-gray-900 text-sm tracking-wide'>
                                                                        {profileData?.id === review.user_id ? (
                                                                            <>
                                                                                <li className='hover:bg-gray-200 px-3 py-2 cursor-pointer flex items-center gap-x-4'>
                                                                                    <CiEdit size={20} className='' />
                                                                                    <span>แก้ไข</span>
                                                                                </li>
                                                                                <li onClick={() => handleDelete(review.review_id)} className='hover:bg-gray-200 px-3 py-2 cursor-pointer flex items-center gap-x-4'>
                                                                                    <PiTrashLight size={20} className='' />
                                                                                    <span>ลบ</span>
                                                                                </li>
                                                                            </>
                                                                        ) : (
                                                                            <li className='hover:bg-gray-200 px-3 py-2 cursor-pointer flex items-center gap-x-4'>
                                                                                <GoReport size={20} className='' />
                                                                                <span>รายงาน</span>
                                                                            </li>
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className='font-light text-sm text-gray-500'>{review.comment}</p>
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                )}
                        </div>
                    ) : (
                        <div className='font-light text-sm text-gray-500 text-justify space-y-4'>
                            <p className=''>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae laudantium quam, cum totam consectetur sed, nihil optio architecto sint nobis vero quidem rem recusandae, dignissimos expedita possimus porro distinctio similique! Perferendis, voluptas. Nihil ab aliquid expedita vel nam omnis modi, quis eos! Voluptate, tenetur veritatis? Tempore quas perferendis est vel dolore eveniet placeat sit, itaque consectetur quos reprehenderit magni aperiam numquam qui ipsum minima harum cum necessitatibus eum debitis maiores perspiciatis quasi officia! Assumenda molestias dolore amet, cumque repellat modi mollitia similique sit quo est perspiciatis sequi tenetur dolorum ipsum ad laborum in. Officiis iste cumque temporibus nesciunt, totam ad?</p>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam eos dolorum repellendus possimus! Voluptates vitae, repellat tenetur libero cum voluptatum commodi earum laudantium voluptate ipsam incidunt perferendis, magnam cupiditate, ab voluptatem doloremque explicabo eum quia.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

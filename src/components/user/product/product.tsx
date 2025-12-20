'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import axios from 'axios';
import Image from 'next/image';
import { FaLayerGroup } from "react-icons/fa";
import { GoSearch } from "react-icons/go";
import { RxCross1, RxReset } from 'react-icons/rx';

export function Products() {
    const router = useRouter();
    const [toggleSearch, setToggleSearch] = useState<boolean>(false);
    const [productName, setProductName] = useState<string>("");
    const [productNameSearch, setProductNameSearch] = useState<string>("");
    const [selectGenders, setSelectGenders] = useState<string[]>([]);
    const [selectCategories, setSelectCategories] = useState<string[]>([]);
    useEffect(() => {
        const timer = setTimeout(() => {
            setProductName(productNameSearch);
        }, 500); // หน่วงเวลา 1 วินาที
        return () => clearTimeout(timer);
    }, [productNameSearch]);
    const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectGenders(prev => [...prev, value]);
        } else {
            setSelectGenders(prev => prev.filter(name => name !== value));
        }
    }
    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectCategories(prev => [...prev, value]);
        } else {
            setSelectCategories(prev => prev.filter(name => name !== value));
        }
    }
    const fetcher = (url: string) => axios.get(url).then(res => res.data);
    const { data: genderList, error: genderError, isLoading: genderLoading } = useSWR('/api/user/product/filter/gender', fetcher,
        {
            onError: (error) => {
                console.log('Gender Fetch Error:', error);
            }
        }
    );
    const { data: categoryList, error: categoryError, isLoading: categoryLoading } = useSWR('/api/user/product/filter/category', fetcher,
        {
            onError: (error) => {
                console.log('Category Fetch Error:', error);
            }
        }
    );
    const getKey = (pageIndex: number, previousPageData: any) => {
        if (previousPageData && !previousPageData.products.length) return null;
        if (previousPageData && previousPageData?.pagination) {
            const { currentPage, totalPages } = previousPageData.pagination;
            if (currentPage >= totalPages) return null;
        }
        return ['/api/user/product',
            {
                page: pageIndex + 1,
                limit: 10,
                gender_name: selectGenders ? selectGenders.join(',') : undefined,
                category_name: selectCategories ? selectCategories.join(',') : undefined,
                product_name: productName || undefined
            }]; // เพิ่ม / ข้างหน้า และส่ง page parameter
    }
    const { data, size, setSize, isLoading: isProductLoading, error, mutate } = useSWRInfinite(
        getKey,
        ([url, params]) => axios.get(url as string, { params }).then(res => res.data), // fetcher ที่รับ parameter ได้ 
        {
            onError: (error) => {
                console.error('Product List Fetch Error:', error);
            }
        }
    );
    // รวมข้อมูลจากทุกหน้า
    const allProducts = data ? data.flatMap(page => page.products) : [];
    const handleResetFilters = () => {
        setSelectGenders([]);
        setSelectCategories([]);
        setProductName("");
        setProductNameSearch("");
    }
    return (
        <div id="product-component" className='my-20'>
            <div className='grid grid-cols-[1fr_4fr] gap-x-6'>
                <div className='space-y-6'>
                    <div className='border border-gray-300 p-5 shadow-sm'>
                        <h3 className='text-gray-900 font-light tracking-wide mb-3'>เพศ / Gender</h3>
                        <div className='space-y-4 '>
                            {genderList && genderList.map((gender: { id: number, gender_name: string }) => (
                                <div key={gender.id} className='flex items-center gap-x-3'>
                                    <input
                                        type="checkbox"
                                        className='size-4.5 accent-gray-700' name={gender.gender_name}
                                        onChange={handleGenderChange}
                                        value={gender.gender_name}
                                        id={gender.gender_name}
                                        checked={selectGenders.includes(gender.gender_name)} />
                                    <label className='font-light tracking-wide text-sm text-gray-700' htmlFor={gender.gender_name}>{gender.gender_name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='border border-gray-300 p-5 shadow-sm'>
                        <h3 className='text-gray-900 font-light tracking-wide mb-3'>ประเภท / Category</h3>
                        <div className='space-y-4'>
                            {categoryList && categoryList.map((category: { id: number, category_name: string }) => (
                                <div key={category.id} className='flex items-center gap-x-3'>
                                    <input type="checkbox"
                                        className='size-4.5 accent-gray-700' name={category.category_name}
                                        onChange={handleCategoryChange}
                                        value={category.category_name}
                                        id={category.category_name}
                                        checked={selectCategories.includes(category.category_name)} />
                                    <label className='font-light tracking-wide text-sm text-gray-700' htmlFor={category.category_name}>{category.category_name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <div className='flex justify-between items-center  mb-6'>
                        <div className="flex items-center gap-x-3">
                            <h1 className="text-gray-800 text-3xl font-light">สินค้าทั้งหมด</h1>
                            <div className="mt-1 w-12 h-0.75 bg-gray-600"></div>
                        </div>
                        <div className={`${toggleSearch ? 'flex gap-x-4' : ''}`}>
                            {toggleSearch && (
                                <div className="w-120 group flex items-center gap-x-4 border border-gray-300  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-md">
                                    <GoSearch className="text-gray-400 group-focus-within:text-gray-800 duration-300" size={20} />
                                    <input value={productNameSearch} onChange={(e) => setProductNameSearch(e.target.value)} type="text" className="font-light w-full tracking-wide text-gray-600 focus:outline-none" placeholder="ค้นหาชื่อสินค้า" autoFocus />
                                </div>
                            )}
                            <div className='flex gap-x-4'>
                                <div onClick={() => setToggleSearch(!toggleSearch)} className='w-fit border border-gray-300 p-2.5 shadow-sm cursor-pointer transition-all duration-300 hover:scale-110'>
                                    {toggleSearch ? <RxCross1 className="text-gray-600 duration-300" size={20} /> : <GoSearch className="text-gray-600 duration-300 " size={20} />}
                                </div>
                                <div onClick={handleResetFilters} className='w-fit border border-gray-300 p-2.5 shadow-sm cursor-pointer transition-all duration-300 hover:scale-110'>
                                    <RxReset className="text-gray-600 duration-300" size={20} />
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='grid grid-cols-3 gap-x-6 gap-y-10 mb-20'>
                        {allProducts?.map((product: { id: number, product_name: string, image_path: string, base_price: number, description: string }) => (
                            <div key={product.id} className='overflow-hidden cursor-pointer ' >
                                <div className='relative  aspect-square overflow-hidden '>
                                    {product.image_path ? (<Image className='absolute object-cover group-hover:scale-105 transition-all duration-500' fill src={product.image_path} alt={product.product_name} />
                                    ) : (
                                        <div className='size-full bg-gray-100 flex justify-center items-center flex-col gap-y-6'>
                                            <FaLayerGroup size={60} className=' text-gray-300 ' />
                                            <p className='text-sm text-gray-800 tracking-wide'>สินค้ายังไม่มีรูปภาพขณะนี้</p>
                                        </div>
                                    )}
                                </div>
                                <div className='tracking-wide  p-4'>
                                    <h3 className='text-gray-900 font-light text-md '>{product.product_name}</h3>
                                    <p className='text-gray-700 font-light text-sm mt-1 truncate'>{product.description || '-'}</p>
                                    <p className='text-gray-900 font-medium mt-3'>฿ {product.base_price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        {(data && data[data.length - 1]?.pagination.currentPage < data[data.length - 1]?.pagination.totalPages) ? (
                            <div className='flex justify-center'>
                                <button
                                    onClick={() => setSize(size + 1)}
                                    className='tracking-wide font-light cursor-pointer text-gray-900 border border-gray-300 shadow-md px-6 py-4 '>โหลดสินค้าเพิ่มเติม</button>
                            </div>
                        ) : <div></div>}
                    </div>
                </div>
            </div>
        </div>
    )
}
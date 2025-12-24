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
import { ProductSkeleton, GenderSkeleton, CategorySkeleton } from '../user/ProductSkeleton';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface ProductParams {
    page: number;
    limit: number;
    gender_name?: string;
    category_name?: string;
    product_name?: string;
}

interface ProductData {
    id: number;
    product_code: string;
    product_name: string;
    category_id: number;
    category_name: string;
    gender_id: number;
    gender_name: string;
    description: string;
    base_price: string;
    image_path: string;
    best_seller: boolean;
    is_active: boolean;
    total_stock: number;
    created_at: string;
}

interface PreviousPageData {
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    },
    products: ProductData[];
}

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
    const getKey = (pageIndex: number, previousPageData: PreviousPageData) => {
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
    const { data, size, setSize, isLoading: isProductLoading, error, mutate, isValidating } = useSWRInfinite(
        getKey,
        ([url, params]: [string, ProductParams]) => axios.get(url, { params }).then(res => res.data), // fetcher ที่รับ parameter ได้ 
        {
            onError: (error) => {
                console.error('Product List Fetch Error:', error);
            }
        }
    );
    const isLoadingMore = isValidating && !isProductLoading;
    // รวมข้อมูลจากทุกหน้า
    const allProducts: ProductData[] = data ? data.flatMap(page => page.products) : [];
    const handleResetFilters = () => {
        setSelectGenders([]);
        setSelectCategories([]);
        setProductName("");
        setProductNameSearch("");
        setSize(1);
    }
    const totalItems = data?.[data.length - 1]?.pagination?.totalItems || 0;
    const currentCount = allProducts.length;
    const progressPercentage = totalItems > 0 ? (currentCount / totalItems) * 100 : 0;
    const currentPage = data?.[data.length - 1]?.pagination?.currentPage || 1;
    const totalPages = data?.[data.length - 1]?.pagination?.totalPages || 1;
    return (
        <div id="product-component" className='my-20'>
            <div className='grid grid-cols-[1fr_4fr] gap-x-6'>
                <div className='space-y-6'>
                    {genderLoading ? (
                        <GenderSkeleton />
                    ) : (
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
                    )}
                    {categoryLoading ? (
                        <CategorySkeleton />
                    ) : (
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
                    )}
                </div>
                <div>
                    <div className='flex justify-between items-center  mb-6'>
                        <div className="flex items-center gap-x-3">
                            <h1 className="text-gray-800 text-3xl font-light">สินค้าทั้งหมด</h1>
                            <div className="mt-1 w-12 h-0.75 bg-gray-600"></div>
                        </div>
                        <div className={`${toggleSearch ? 'flex gap-x-4' : ''}`}>
                            {toggleSearch && (
                                <div className="w-120 group flex items-center gap-x-4 border border-gray-300 hover:border-gray-500  px-4 py-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-md">
                                    <GoSearch className="text-gray-400 group-focus-within:text-gray-800 duration-300" size={20} />
                                    <input value={productNameSearch} onChange={(e) => setProductNameSearch(e.target.value)} type="text" className="font-light w-full tracking-wide text-gray-600 focus:outline-none" placeholder="ค้นหาชื่อสินค้า" autoFocus />
                                </div>
                            )}
                            <div className='flex gap-x-4'>
                                <div onClick={() => setToggleSearch(!toggleSearch)} className='w-fit border border-gray-300 p-2.5 hover:border-gray-500 shadow-sm cursor-pointer transition-all duration-300 hover:scale-110'>
                                    {toggleSearch ? <RxCross1 className="text-gray-600 duration-300" size={20} /> : <GoSearch className="text-gray-600 duration-300 " size={20} />}
                                </div>
                                <div onClick={handleResetFilters} className='w-fit border border-gray-300 p-2.5 hover:border-gray-500 shadow-sm cursor-pointer transition-all duration-300 hover:scale-110'>
                                    <RxReset className="text-gray-600 duration-300" size={20} />
                                </div>
                            </div>

                        </div>
                    </div>
                    {isProductLoading ? (
                        <div className='grid grid-cols-3 gap-x-6 gap-y-10 mb-20'>
                            {Array.from({ length: 10 }).map((_, index) => (
                                <ProductSkeleton key={index} />
                            ))}
                        </div>
                    ) : allProducts.length === 0 ? (
                        <div className='flex flex-col items-center  justify-center tracking-wide py-15 border border-gray-300 bg-gray-100  shadow-sm'>
                            <div className='mb-10'>
                                <GoSearch className="text-gray-400" size={40} />
                            </div>
                            <div className='flex items-center flex-col justify-center space-y-2 mb-6'>
                                <h3 className='text-lg font-normal text-gray-800'>ไม่พบสินค้าที่คุณค้นหา</h3>
                                <p className='text-sm font-light text-gray-600'>ลองตรวจสอบคำสะกด หรือล้างตัวกรองเพื่อดูสินค้าทั้งหมด</p>
                            </div>
                            <button onClick={handleResetFilters} className='font-light bg-white text-sm cursor-pointer text-gray-700 border border-gray-300 shadow-sm hover:border-gray-500 hover:text-gray-900 px-5 py-3 disabled:opacity-50 disabled:cursor-default hover:scale-105 transition-all duaration-300'>ล้างตัวกรองทั้งหมด</button>
                        </div>
                    ) : (<div className='grid grid-cols-3 gap-x-6 gap-y-10 mb-20'>
                        {allProducts?.map((product) => {
                            const isOutOfStock = Number(product.total_stock) === 0;
                            return (
                                <div onClick={() => {
                                    if (isOutOfStock) return;
                                    router.push(`/user/product/${product.id}-${product.product_code}-${product.product_name}`);
                                }} key={product.id} className={`${isOutOfStock ? 'cursor-default' : 'cursor-pointer'} overflow-hidden group transition-all duration-300 ease-out border border-transparent hover:border-gray-300 hover:-translate-y-2 hover:shadow-lg`} >

                                    <div className='relative  aspect-square overflow-hidden '>
                                        {product.image_path ? (<Image className='absolute object-cover group-hover:scale-105 transition-all  duration-500' fill src={product.image_path} alt={product.product_name} />
                                        ) : (
                                            <div className='size-full bg-gray-100 flex justify-center items-center flex-col gap-y-6'>
                                                <FaLayerGroup size={60} className=' text-gray-300 ' />
                                                <p className='text-xs text-gray-500 font-light tracking-wide'>ไม่มีรูปภาพสินค้า</p>
                                            </div>
                                        )}
                                        {isOutOfStock && (
                                            <div className="absolute top-4 right-4 z-20">
                                                <span className="bg-red-600 shadow-md text-white text-xs font-light px-2 py-1 uppercase tracking-wider">
                                                    Sold Out
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className='tracking-wide  p-4'>
                                        <h3 className='text-gray-900 font-light text-md '>{product.product_name}</h3>
                                        <p className='text-gray-700 font-light text-sm mt-1 truncate'>{product.description || '-'}</p>
                                        <p className='text-gray-900 font-medium mt-3'>฿ {Number(product.base_price).toLocaleString()}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>)}
                    <div>
                        {(data && currentCount && totalItems > 0) ? (
                            <div className='flex flex-col items-center justify-center space-y-6'>
                                <p className='text-gray-900 font-light tracking-wide text-sm'>กำลังแสดง {currentCount} รายการ จากทั้งหมด {totalItems} รายการ</p>
                                <div className='w-90 h-1.5 bg-gray-200 rounded-full overflow-hidden'>
                                    <div className={`h-full bg-gray-800 transition-all duration-500 ease-out`} style={{ width: `${progressPercentage}%` }}>

                                    </div>
                                </div>
                            </div>
                        ) : null}
                        {(data && currentPage < totalPages) ? (
                            <div>
                                <div className='flex justify-center mt-6'>
                                    <button
                                        disabled={isLoadingMore}
                                        onClick={() => setSize(size + 1)}
                                        className={`tracking-wide font-light text-sm cursor-pointer text-gray-700 border border-gray-300 shadow-sm hover:border-gray-500 hover:text-gray-900 px-5 py-3 disabled:opacity-50 disabled:cursor-default hover:scale-105 transition-all duaration-300`}>
                                        {isLoadingMore ? <>
                                            <div className='flex items-center gap-x-4'>
                                                <p>กำลังโหลดสินค้า</p>
                                                <AiOutlineLoading3Quarters className="animate-spin text-gray-500" size={20} />
                                            </div>
                                        </> : <>
                                            ดูสินค้าเพิ่มเติม
                                        </>}
                                    </button>
                                </div>
                            </div>
                        ) : <div></div>}

                    </div>
                </div>
            </div>
        </div >
    )
}
'use client';
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/user/cartContext';
import axios from 'axios';
import Swal from 'sweetalert2';

const regexProductCodeFromURL = (slug: string) => {
    if (!slug) return null;
    const match = slug.match(/(PDT-\d+)/);
    return match ? match[1] : null;
}

const regexProductIdFromURL = (slug: string) => {
    if (!slug) return null;
    const match = slug.match(/^(\d+)-/);
    return match ? match[1] : null;
}

interface ProductVariantData {
    id: number;
    product_id: number;
    size: string;
    sku_code: string;
    stock_quantity: number;
    created_at: string;
}

const fetcher = (url: string) => axios.get(url).then(res => res.data);
const showErrorAlert = (message: string) => {
    Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถเพิ่มสินค้าลงตะกร้าได้',
        text: message,
        confirmButtonText: 'ตกลง'
    });
}

export function ProductByCode() {
    const { mutateCart } = useCart();
    const router = useRouter();
    const params = useParams();
    const { slug } = params as { slug: string };
    const productCode = regexProductCodeFromURL(slug);
    const productId = regexProductIdFromURL(slug);
    const { data: productData, error: productError, isLoading: productIsLoading } = useSWR(
        productCode ? `/api/user/product/${productCode}` : null,
        fetcher,
        {
            onError: (error) => {
                console.error('Error fetching product data:', error);
            }
        }
    );
    const { data: variantData, error: variantError, isLoading: variantIsLoading } = useSWR(
        productId ? `/api/user/product/variant/${productId}` : null,
        fetcher,
        {
            onError: (error) => {
                console.error('Error fetching variant data:', error);
            }
        }
    );
    const handleUpsertCart = async (variantId: number, quantity: number) => {
        try {
            const response = await axios.put('/api/user/cart', {
                variantId, quantity
            });
            const result = response.data;
            mutateCart();
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.log('Upsert Cart error response:', error.response.data.error.message || error.message);
                showErrorAlert(error.response?.data.error.message || 'Internal Server Error');
                return;
            }
            console.error('Upsert Cart error:', error);
            showErrorAlert('เกิดข้อผิดพลาดภายในระบบ');
        }
    }
    const [selectVariantId, setSelectVariantId] = useState<number | null>(null);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    return (
        <div id="product-by-code-component" className="my-10">
            <div className='grid grid-cols-2  gap-x-10'>
                <div className='h-130 flex gap-4'>
                    <div className=' flex flex-col gap-4 w-30 shrink-0'>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className='relative aspect-4/4 h-full w-full overflow-hidden'>
                                <Image fill
                                    src={productData?.image_path}
                                    alt={productData?.product_name || 'Product Image'}
                                    className="object-cover absolute"
                                />
                            </div>
                        ))}
                    </div>
                    <div className='relative flex-1 overflow-hidden'>
                        <Image fill
                            src={productData?.image_path}
                            alt={productData?.product_name || 'Product Image'}
                            className="object-cover absolute"
                        />
                    </div>
                </div>
                <div className='tracking-wide '>
                    <div className='space-y-2 border-b border-gray-200 pb-6 mb-6'>
                        <h2 className='text-2xl font-normal text-gray-800'>{productData?.product_name}</h2>
                        <p className='font-light text-gray-500'>{productData?.description || `No Description`}</p>
                        <p className='text-3xl text-gray-800 font-medium'>{Number(productData?.base_price).toLocaleString()} บาท</p>
                    </div>
                    <div>
                        <p className='font-light text-sm text-gray-500 border-b border-gray-200 pb-6 mb-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum sint perspiciatis, soluta ratione odio illo! Officiis ad hic architecto accusamus repudiandae amet nihil perferendis neque ipsa nesciunt, atque ullam et omnis iure tempore. Inventore ut, iure dignissimos delectus fugit praesentium?</p>
                        <div className=' mb-8'>
                            <h2 className={`text-gray-600 text-lg font-normal  mb-4`}>เลือกไซส์</h2>
                            <div className={` flex items-center gap-x-5`}>
                                {variantData?.map((data: ProductVariantData) => {
                                    const stock = Number(data?.stock_quantity || 0);
                                    return (
                                        <button key={data.id}
                                            onClick={() => {
                                                if (stock === 0) return;

                                                setSelectVariantId(data.id);
                                                setIsMounted(false);
                                            }}
                                            className={`${selectVariantId === data.id && 'border-gray-600 text-gray-800 shadow-md'} ${stock === 0 ? 'bg-gray-200 cursor-default' : 'cursor-pointer hover:border-gray-600 hover:shadow-md hover:text-gray-800'} size-12 bg-gray-50 text-md border-2 font-light border-gray-300 text-gray-600 transition-all duration-100 `}
                                        >
                                            {data.size}
                                        </button>
                                    )
                                })}
                            </div>
                            <p className='text-sm text-red-600 font-light mt-4'>{isMounted && !selectVariantId && "กรุณาเลือกไซส์"}</p>
                        </div>
                        <div className=''>
                            <button
                                onClick={() => {
                                    if (!selectVariantId) {
                                        setIsMounted(true);
                                        return;
                                    }
                                    handleUpsertCart(selectVariantId, 1);
                                }}

                                className={`cursor-pointer text-md bg-black text-white font-light px-6 py-3 shadow-md transition-all duration-100 hover:opacity-70`}>เพิ่มในตะกร้าสินค้า</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

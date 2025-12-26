'use client';
import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/user/cartContext';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { RxPlus } from "react-icons/rx";
import { RxBorderSolid } from "react-icons/rx";
import { PiTrash, PiTrashLight } from "react-icons/pi";
import Swal from 'sweetalert2';
import { FaLayerGroup } from 'react-icons/fa';
import { ProductNoImage } from './ProductSkeleton';
import { HiOutlineShoppingBag } from 'react-icons/hi2';

interface ItemData {
    item_id: number;
    product_id: number;
    product_code: string;
    product_name: string;
    description: string;
    image_path: string;
    size: string;
    max_stock: number;
    quantity: number;
    total_item_price: number;
}

interface UpdateCartItemQuantityParams {
    (cartItemId: number, newQuantity: number): void;
}

interface DeleteCartItemParams {
    (cartItemId: number): void;
}

const showErrorAlert = (message: string) => {
    Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถเพิ่มสินค้าลงตะกร้าได้',
        text: message,
        confirmButtonText: 'ตกลง'
    });
}

export function CartItems(
    { item, updateCartItemQuantity, deleteCartItem }:
        {
            item: ItemData,
            updateCartItemQuantity: UpdateCartItemQuantityParams,
            deleteCartItem: DeleteCartItemParams
        }) {
    const router = useRouter();
    const [quantity, setQuantity] = useState<number>(item?.quantity);
    useEffect(() => {
        setQuantity(item?.quantity);
    }, [item?.quantity]);
    useEffect(() => {
        if (quantity !== item?.quantity) {
            const timer = setTimeout(() => {
                updateCartItemQuantity(item?.item_id, quantity);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [quantity]);

    const handleIncrease = () => {
        setQuantity(prev => prev + 1);
    }
    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    }
    const handleDelete = () => {
        deleteCartItem(item?.item_id);
    }
    return (
        <div>
            <div key={item.item_id} className='border-b border-gray-300 pb-5 mb-5'>
                <div className='flex justify-between items-center'>
                    <div className='flex  gap-x-5'>
                        <div >
                            {item?.image_path ? (
                                <div onClick={() => router.push(`/user/product/${item?.product_id}-${item.product_code}-${item.product_name}`)} className='cursor-pointer size-35 aspect-square relative shadow-md overflow-hidden '>
                                    <Image
                                        className='absolute'
                                        fill
                                        src={item?.image_path || 'Product Image'}
                                        alt={item?.product_name || 'Product Image'}
                                    />
                                </div>
                            ) : (
                                <div onClick={() => router.push(`/user/product/${item?.product_id}-${item.product_code}-${item.product_name}`)} className='cursor-pointer border border-gray-300 size-35 aspect-square relative'>
                                    <ProductNoImage image='small_image' />
                                </div>
                            )}
                        </div>
                        <div className='flex flex-col justify-between'>
                            <h2 className='text-gray-900 font-light text-md'>{item?.product_name}</h2>
                            <p className='text-gray-700 font-light text-sm truncate'>{item?.description || 'No Description'}</p>
                            <p className='text-gray-900 font-medium'>฿ {Number(item?.total_item_price).toLocaleString()}</p>
                            <div className='flex justify-center items-center  size-10 bg-gray-50 text-md border font-light border-gray-300 text-gray-600 transition-all duration-100'>
                                <p>{item?.size}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='flex items-center gap-x-2'>
                            <button
                                onClick={quantity > 1 ? handleDecrease : handleDelete}

                                type='button' className={` size-8 flex items-center justify-center text-gray-800 border border-gray-200 cursor-pointer bg-gray-200 transition-all duration-100 hover:bg-gray-300`}>
                                <RxBorderSolid size={15} />
                            </button>
                            <div className='border border-gray-300 h-8 w-18 flex items-center justify-center'>
                                <p className='font-light text-gray-800'>{quantity}</p>
                            </div>
                            <button
                                onClick={handleIncrease}
                                disabled={quantity >= item?.max_stock}
                                type='button' className={`size-8 flex items-center justify-center text-gray-800 border border-gray-200 cursor-pointer bg-gray-200 transition-all duration-100 hover:bg-gray-300 ${quantity >= item?.max_stock && 'opacity-40 cursor-default hover:bg-gray-200'}`}>
                                <RxPlus size={15} />
                            </button>
                        </div>
                    </div>
                    <div className=''>
                        <div>
                            <PiTrashLight onClick={handleDelete} className='text-gray-900 cursor-pointer transition-all duration-200 hover:scale-110' size={25} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function MyCart() {
    const { cartData, mutateCart, cartIsLoading } = useCart();
    const router = useRouter();
    const updateCartItemQuantity = async (cartItemId: number, newQuantity: number) => {
        try {
            const response = await axios.put(`/api/user/cart/${cartItemId}`, {
                newQuantity
            });
            const result = response.data;
            mutateCart();
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error updating cart item quantity:', error.response.data.error.message || error.message);
                showErrorAlert(error.response?.data.error.message || 'เกิดข้อผิดพลาดภายในระบบ');
                return;
            }
            console.error('Error updating cart item quantity:', error);
            showErrorAlert('เกิดข้อผิดพลาดภายในระบบ');
        }
    }
    const deleteCartItem = async (cartItemId: number) => {
        try {
            const response = await axios.delete(`/api/user/cart/${cartItemId}`);
            const result = response.data;
            mutateCart();
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error deleting cart item:', error.response.data.message || error.message);
                showErrorAlert(error.response?.data.error.message || 'เกิดข้อผิดพลาดภายในระบบ');
                return;
            }
            console.error('Error deleting cart item quantity:', error);
            showErrorAlert('เกิดข้อผิดพลาดภายในระบบ');
        }
    }
    return (
        <div id="my-cart-component">
            <div className='my-20'>
                <div className="flex items-center gap-x-3 mb-10">
                    <h1 className="text-gray-800 text-3xl font-light">ตะกร้าสินค้า</h1>
                    <div className="mt-1 w-12 h-0.75 bg-gray-600"></div>
                </div>
                <div className='grid grid-cols-[3fr_1fr] gap-x-8'>
                    <div className=''>
                        {cartData?.items.length === 0 ? (
                            <div className='h-full flex flex-col items-center  justify-center tracking-wide '>
                                <div className='mb-10'>
                                    <HiOutlineShoppingBag className="text-gray-400" size={40} />
                                </div>
                                <div className='flex items-center flex-col justify-center space-y-2 mb-6'>
                                    <h3 className='text-lg font-normal text-gray-800'>ตะกร้าสินค้าของคุณว่างเปล่า</h3>
                                    <p className='text-sm font-light text-gray-600'>คุณยังไม่ได้เพิ่มสินค้าใดๆ ลงในตะกร้า</p>
                                </div>
                                <button onClick={() => router.push('/user/product')} className='font-light bg-white text-sm cursor-pointer text-gray-700 border border-gray-300 shadow-sm hover:border-gray-500 hover:text-gray-900 px-5 py-3 disabled:opacity-50 disabled:cursor-default hover:scale-105 transition-all duaration-300'>กลับไปเลือกซื้อสินค้า</button>
                            </div>
                        ) : (
                            <div className='h-135 overflow-y-auto pr-5'>
                                {cartData?.items.map((item: ItemData) => (
                                    <CartItems key={item.item_id}
                                        item={item}
                                        updateCartItemQuantity={updateCartItemQuantity}
                                        deleteCartItem={deleteCartItem} />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className='border border-gray-300 p-4.5 h-fit tracking-wide shadow-md'>
                        <h2 className='text-xl mb-6.5'>สรุป</h2>
                        <div className='text-gray-900 font-light text-md space-y-5'>
                            <div className='flex justify-between items-center '>
                                <p>ยอดรวมย่อย</p>
                                <p>฿ {Number(cartData?.summary?.total_cart_price).toLocaleString()}</p>
                            </div>
                            <div className='flex justify-between items-center border-b border-gray-300 pb-5 mb-5'>
                                <p>ค่าธรรมเนียมการจัดส่ง</p>
                                <p>ฟรี</p>
                            </div>
                        </div>
                        <div>
                            <div className='flex justify-between items-center text-gray-900 font-medium border-b border-gray-300 mb-5 pb-5'>
                                <p>ยอดรวม</p>
                                <p>฿ {Number(cartData?.summary?.total_cart_price).toLocaleString()}</p>
                            </div>
                        </div>
                        <div

                            className=' '>
                            <button
                                disabled={cartData?.items.length === 0}
                                onClick={() => router.push('/user/checkout')}
                                className={`${cartData?.items.length === 0 ? 'opacity-50 cursor-default' : 'hover:opacity-70 cursor-pointer '} bg-black w-full text-white font-light text-md py-2.5 transition-all duration-100 `}>ชำระเงิน</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
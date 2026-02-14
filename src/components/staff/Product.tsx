'use client';
import React, { useState, useEffect, FC } from 'react'
import useSWR from 'swr';
import axios from 'axios';
import { DateTime } from 'luxon';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { GoCalendar, GoPlus, GoSearch } from 'react-icons/go';
import { FaLayerGroup } from 'react-icons/fa';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { CiEdit } from 'react-icons/ci';
import { PiImagesSquareLight, PiTrashLight, PiUser } from 'react-icons/pi';
import { RxCross2, RxReset } from 'react-icons/rx';
import { useSearchParams } from 'next/navigation';
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import Select from 'react-select';
import ActiveSwitch from '../input/ActiveSwitch';
import { PiImages } from "react-icons/pi";

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const formatThaiDate = (dateString: string) => {
    return DateTime.fromISO(dateString)
        .plus({ hours: 7 })
        .setLocale('th')
        .toFormat('d LLLL yyyy HH:mm');
};

export const ProductList: FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchProductName, setSearchProductName] = useState('');
    const [productName, setProductName] = useState('');
    const [searchProductCode, setSearchProductCode] = useState('');
    const [productCode, setProductCode] = useState('');
    const [openAddProductModal, setOpenAddProductModal] = useState(false);
    const [openProductDetail, setOpenProductDetail] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setProductName(searchProductName);
            setProductCode(searchProductCode);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchProductName, searchProductCode]);

    const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        product_name: productName.trim(),
        product_code: productCode.trim(),
    });
    const { data: products, error: productError, isLoading: isProductLoading, isValidating, mutate } = useSWR(`/api/staff/product?${params.toString()}`, fetcher,
        { onError: (err) => { console.error('Error fetching product data:', err); } }
    );

    const productList = products?.products || [];
    const totalPages = products?.pagination?.totalPages || 1;

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleUpdateStatus = async (productId: number, isActive: boolean) => {
        try {
            const response = await axios.patch(`/api/staff/product/${productId}`,
                { is_active: isActive }
            );
            mutate();
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Update Product Status error response:', error.response.data);
                Swal.fire({
                    icon: 'error',
                    title: 'อัปเดตสถานะสินค้าไม่สำเร็จ',
                    text: error.response.data.error.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะสินค้า',
                    confirmButtonText: 'ตกลง'
                });
                return;
            }
            console.error('Update Product Status error:', error);
        }
    }

    return (
        <div id="staff-product-list-components" className='tracking-wide'>
            <div>
                <h2 className='text-xl font-light text-gray-800 mb-4'>รายการสินค้า</h2>
                <div className='flex justify-between items-start'>
                    <div className='flex items-center gap-x-5'>
                        <div className="w-70 group flex items-center gap-x-4 border border-gray-300 hover:border-gray-500  px-4 py-2.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm">
                            <GoSearch className="text-gray-400 group-focus-within:text-gray-800 duration-300" size={20} />
                            <input onChange={(e) => setSearchProductName(e.target.value)} type="text" className="font-light text-sm w-full tracking-wide text-gray-600 focus:outline-none" placeholder="ค้นหาด้วยชื่อสินค้า" />
                        </div>
                        <div className="w-70 group flex items-center gap-x-4 border border-gray-300 hover:border-gray-500  px-4 py-2.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm">
                            <GoSearch className="text-gray-400 group-focus-within:text-gray700 duration-300" size={20} />
                            <input onChange={(e) => setSearchProductCode(e.target.value)} type="text" className="font-light text-sm w-full tracking-wide text-gray-600 focus:outline-none" placeholder="ค้นหาด้วยรหัสสินค้า" />
                        </div>
                    </div>
                    <div className='flex items-center gap-x-5 mb-6'>
                        <div className='w-fit border border-gray-300 p-2.5 hover:border-gray-500 shadow-sm cursor-pointer transition-all duration-300 hover:scale-110'>
                            <RxReset className="text-gray-600 duration-300" size={20} />
                        </div>
                        <button onClick={() => setOpenAddProductModal(true)} className='flex items-center gap-x-2 font-light bg-white text-sm cursor-pointer text-gray-700 border border-gray-300 shadow-sm hover:border-gray-500 hover:text-gray-900 px-4 py-2.5 hover:scale-105 transition-all duaration-300'>
                            <GoPlus size={20} />
                            <span>
                                เพิ่มสินค้าใหม่
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <div className=''>
                <table className='w-full text-sm text-left table-fixed'>
                    <thead className='text-gray-500 [&_th]:font-light bg-slate-50 border border-gray-300'>
                        <tr className=''>
                            <th className='pl-2.5 py-2.5 w-[25%]'>สินค้า</th>
                            <th className='w-[15%]'>จำนวนสินค้า (ชิ้น)</th>
                            <th className='w-[15%]'>หมวดหมู่</th>
                            <th className='w-[10%]'>เพศ</th>
                            <th className='w-[10%]'>ราคา (บาท)</th>
                            <th className='w-[10%]'>สถานะการขาย</th>
                            <th className='w-[10%] text-center'>จัดการสินค้า</th>
                        </tr>
                    </thead>
                    <tbody className='text-gray-700 [&_td]:font-light [&>tr>td]:py-2.5'>
                        {productList?.map((product: any) => (
                            <tr key={product.product_id} className='border-b border-gray-300'>
                                <td className=''>
                                    <div className='flex items-center gap-x-4'>
                                        <div className='relative size-15 overflow-hidden border border-gray-300'>
                                            {product.image_path ? (
                                                <div>
                                                    <Image className='absolute' src={product.image_path || ''} alt={product.product_name || ''} fill />
                                                </div>
                                            ) : (
                                                <div className='size-full bg-gray-100 flex justify-center items-center flex-col gap-y-6'>
                                                    <FaLayerGroup size={20} className=' text-gray-300 ' />
                                                </div>
                                            )}
                                        </div>
                                        <div className='flex flex-col space-y-1'>
                                            <p>{product.product_name}</p>
                                            <p className='text-gray-500'>{product.product_code}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>{product.sum_stock_quantity}</td>
                                <td className=''>{product.category_name}</td>
                                <td>{product.gender_name}</td>
                                <td className=''>{Number(product.base_price).toLocaleString()}</td>
                                <td className=''>
                                    <div className='flex justify-center items-center'>
                                        <ActiveSwitch checked={product.is_active} onChange={(isChecked: boolean) => handleUpdateStatus(product.product_id, isChecked)} activeText='' inactiveText='' />
                                    </div>
                                </td>
                                <td className=''>
                                    <div className="flex items-center justify-center gap-x-4">
                                        <button
                                            onClick={() => setOpenProductDetail(product)}
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
            {openAddProductModal && <AddProductModal mutate={mutate} onClose={() => setOpenAddProductModal(false)} />}
            {openProductDetail && <ProductDetailModal product={openProductDetail} mutate={mutate} onClose={() => setOpenProductDetail(null)} />}
        </div >
    )
}

interface AddProductModalProps {
    mutate: () => void;
    onClose: () => void;
}

const AddProductModal: FC<AddProductModalProps> = ({ onClose, mutate }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    interface CategoryOption {
        value: number;
        label: string;
    }

    const { data: categoryList, error: errorCategory, isLoading: isLoadingCategory } = useSWR('/api/user/product/filter/category', fetcher,
        { onError: (err) => { console.error('Error fetching category data:', err); } }
    );

    const [isActive, setIsActive] = useState(1);
    const [isBestSeller, setIsBestSeller] = useState(0);
    const genderMenu = [
        { value: 1, label: 'ชาย' },
        { value: 2, label: 'หญิง' },
        { value: 3, label: 'เด็ก' }
    ]
    const [product_name, setProduct_name] = useState('');
    const [description, setDescription] = useState('');
    const [base_price, setBase_price] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);
    const [selectedGender, setSelectedGender] = useState<number | null>(null);
    const [variants, setVariants] = useState<any>([]);
    const presetSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
    const toggleVariantSize = (sizeLabel: string) => {
        const exists = variants.find((v: any) => v.size === sizeLabel);
        if (exists) {
            setVariants(variants.filter((v: any) => v.size !== sizeLabel));
        } else {
            setVariants([
                ...variants,
                {
                    size: sizeLabel,
                    stock_quantity: 0,
                }
            ]);
        }
    }
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (product_name && base_price && selectedCategory && selectedGender && variants.length > 0) {
                const confirmResult = await Swal.fire({
                    title: 'ยืนยันการสร้างสินค้า',
                    text: `คุณต้องการสร้างสินค้านี้หรือไม่?`,
                    icon: 'question',
                    confirmButtonText: 'ยืนยัน',
                    confirmButtonColor: '#3085d6',
                    showCancelButton: true,
                    cancelButtonColor: '#6B7280',
                    cancelButtonText: 'ยกเลิก'
                });
                if (!confirmResult.isConfirmed) return;
            }
            const formData = new FormData();
            formData.append('product_name', product_name);
            formData.append('description', description);
            formData.append('base_price', base_price);
            formData.append('category_id', selectedCategory ? String(selectedCategory.value) : '');
            formData.append('gender_id', selectedGender ? String(selectedGender) : '');
            formData.append('is_active', String(isActive));
            formData.append('best_seller', String(isBestSeller));
            formData.append('variants', JSON.stringify(variants));
            if (image) { formData.append('image', image); }
            const response = await axios.post('/api/staff/product', formData);
            Swal.fire({
                icon: 'success',
                title: response.data.message || 'สร้างสินค้าสำเร็จ',
                confirmButtonText: 'ตกลง'
            });
            mutate();
            onClose();
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.log('สร้างสินค้าไม่สำเร็จ:', error.response.data.error.message);
                Swal.fire({
                    icon: 'error',
                    title: 'สร้างสินค้าไม่สำเร็จ',
                    text: error.response.data.error.message || 'เกิดข้อผิดพลาดในการสร้างสินค้า',
                    confirmButtonText: 'ตกลง'
                });
                return;
            }
            console.error('Error creating product:', error);
        }
    }

    return (
        <div id="user-cancelled-order-popup-component">
            <div className="px-4 md:px-0 fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-75 max-w-180 w-full bg-white rounded-[5px] py-4 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-4 pb-4 mb-4'>
                        <div className='flex items-center gap-x-2'>
                            <h2 className=' font-normal text-gray-800'>เพิ่มรายการสินค้า</h2>
                        </div>
                        <button className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 onClick={onClose} size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-4 font-light '>
                        <div>
                            <form onSubmit={handleCreateProduct} action="" className='grid grid-cols-[2fr_1.5fr] gap-x-4'>
                                <div className='space-y-5 border-r border-gray-300 pr-4 mb-4'>
                                    <div className='flex flex-col space-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="product_name">ชื่อสินค้า</label>
                                        <input onChange={(e) => setProduct_name(e.target.value)} name='product_name' className="w-full border border-gray-300 hover:border-gray-500  px-4 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type="text" autoFocus />
                                    </div>
                                    <div className='flex flex-col space-y-2'>
                                        <label className='text-sm text-gray-700' htmlFor="description">รายละเอียด</label>
                                        <textarea onChange={(e) => setDescription(e.target.value)} name='description' className="w-full h-20 border border-gray-300 hover:border-gray-500  p-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" />
                                    </div>
                                    <div className='flex items-center gap-x-4'>
                                        <label className='text-sm text-gray-700' htmlFor="base_price">ราคา (บาท)</label>
                                        <input onChange={(e) => setBase_price(e.target.value)} name='base_price' className="w-30 border border-gray-300 hover:border-gray-500  px-4 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" type='number' placeholder='0.00' />
                                    </div>
                                    <div className='border-t border-gray-300 pt-4'>
                                        <div className='flex items-center justify-between'>
                                            {presetSizes.map((size, index) => (
                                                <button type='button' onClick={() => toggleVariantSize(size)} className={`${variants.some((v: any) => v.size === size) && 'border-gray-600 text-gray-800 shadow-md'} cursor-pointer size-10 bg-gray-50 text-sm border-2 font-light border-gray-300 text-gray-600 transition-all duration-100 hover:bg-gray-200 active:scale-110`} key={index}>
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='space-y-5 h-53 overflow-y-auto'>
                                        {variants?.length === 0 ? (
                                            <div className='size-full  flex justify-center items-center flex-col gap-y-6'>
                                                <FaLayerGroup size={50} className=' text-gray-300 ' />
                                                <p className='text-xs text-gray-500 font-light tracking-wide'>ยังไม่ได้เลือก Size</p>
                                            </div>
                                        ) : (
                                            <div className='space-y-4 pr-3'>
                                                {variants?.map((variant: any, index: number) => (
                                                    <div key={variant.size}>
                                                        <div className='flex justify-between items-center pt-0.5'>
                                                            <div className=''>
                                                                <p className='w-fit text-sm text-gray-700'>Size {variant.size}</p>
                                                            </div>
                                                            <div className='flex items-center gap-x-4'>
                                                                <label className='text-sm text-gray-700' htmlFor="">จำนวน</label>
                                                                <input type='number'
                                                                    onChange={(e) => {
                                                                        const updateQuantity = [...variants];
                                                                        updateQuantity[index].stock_quantity = Number(e.target.value);
                                                                        setVariants(updateQuantity);
                                                                    }}
                                                                    className='w-20 border border-gray-300 hover:border-gray-500  px-4 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none' placeholder='0' />
                                                                <button
                                                                    onClick={() => setVariants(variants.filter((v: any) => v.size !== variant.size))}
                                                                    type='button'
                                                                    className='cursor-pointer'>
                                                                    <PiTrashLight className="text-gray-600" size={22} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='flex flex-col justify-between'>
                                    <div className='space-y-5'>
                                        <div className='flex flex-col space-y-2'>
                                            <label className='text-sm text-gray-700' htmlFor="">รูปภาพสินค้า</label>
                                            <div className='bg-slate-100 h-45 py-4 border-2 border-dashed border-gray-300 hover:border-gray-500 duration-300 group'>
                                                <div className='flex justify-center items-center h-full'>
                                                    <div
                                                        className={`relative size-40 w-full`}
                                                        style={{ cursor: 'pointer', overflow: 'hidden' }}
                                                    >
                                                        {previewUrl ? (
                                                            <Image src={previewUrl} fill alt="preview" className='absolute object-contain' />
                                                        ) : (
                                                            <div className='flex flex-col items-center justify-center h-full gap-y-2'>
                                                                <PiImagesSquareLight className='text-gray-300 group-hover:text-gray-500 duration-300' size={40} />
                                                                <p className='text-xs text-left text-gray-400 group-hover:text-gray-600 duration-300 tracking-wide'>ลากและวางไฟล์ หรือคลิกเพื่อเลือกไฟล์</p>
                                                            </div>
                                                        )}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                                            onChange={handleFileChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex flex-col space-y-2'>
                                            <label className='text-sm text-gray-700' htmlFor="category">หมวดหมู่</label>
                                            <Select
                                                className='text-sm'
                                                value={selectedCategory}
                                                onChange={setSelectedCategory}
                                                options={categoryList?.map((category: any) =>
                                                    ({ value: category.id, label: category.category_name })
                                                )}
                                                placeholder="เลือกหมวดหมู่" />
                                        </div>
                                        <div className='flex flex-col space-y-2'>
                                            <label className='text-sm text-gray-700' htmlFor="gender">เพศ</label>
                                            <div className='flex items-center gap-x-8'>
                                                {genderMenu?.map((gender) => (
                                                    <div key={gender.value} className='flex items-center gap-x-2'>
                                                        <input onChange={() => setSelectedGender(gender.value)} value={gender.value} name={`gender`} className='accent-gray-600' id={`gender-${gender.label}`} type='radio' />
                                                        <label className='text-sm text-gray-800 font-light ' htmlFor={`gender-${gender.label}`}>{gender.label}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-y-2'>
                                            <label className='text-sm text-gray-700' htmlFor="is_active">สถานะการใช้งาน</label>
                                            <ActiveSwitch checked={isActive} onChange={setIsActive} />
                                        </div>
                                        <div className='flex flex-col gap-y-2'>
                                            <label className='text-sm text-gray-700' htmlFor="best_seller">สินค้าขายดี</label>
                                            <ActiveSwitch checked={isBestSeller} onChange={setIsBestSeller} />
                                        </div>
                                    </div>
                                    <div className='flex justify-end gap-x-4'>
                                        <button onClick={onClose} type='button' className='text-sm  cursor-pointer rounded shadow px-5 py-2 bg-white text-gray-700 font-light border border-gray-300 duration-200 hover:bg-gray-100'>ยกเลิก</button>
                                        <button type='submit' className='text-sm  cursor-pointer rounded px-5 py-2 bg-black text-white font-light duration-200 hover:opacity-80 '>เพิ่มสินค้า</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface ProductDetailModalProps {
    onClose: () => void;
    mutate: () => void;
    product: any;
}

const ProductDetailModal: FC<ProductDetailModalProps> = ({ product, onClose, mutate }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    const { data: categoryList, error: categoryError, isLoading: isCategoryLoading } = useSWR('/api/user/product/filter/category', fetcher, {
        onError: (err) => { console.error('Error fetching category data:', err); }
    });

    const { data: genderList, error: genderError, isLoading: isGenderLoading } = useSWR('/api/user/product/filter/gender', fetcher, {
        onError: (err) => { console.error('Error fetching gender data:', err); }
    });

    const [isEditMode, setIsEditMode] = useState(false);
    const [product_name, setProduct_name] = useState(product.product_name);
    const [base_price, setBase_price] = useState(product.base_price);
    const [description, setDescription] = useState(product.description);
    const [is_active, setIs_active] = useState(product.is_active);
    const [best_seller, setBest_seller] = useState(product.best_seller);
    const [selectedCategory, setSelectedCategory] = useState<any>({ value: product.category_id, label: product.category_name });
    const [selectedGender, setSelectedGender] = useState<any>({ value: product.gender_id, label: product.gender_name });
    const [editVariants, setEditVariants] = useState<any>(product?.variants || []);
    const presetSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
    const [image, setImage] = useState<File | null>(product?.image_path || null);

    const toggleVariantSize = (sizeLabel: string) => {
        const exists = editVariants.find((v: any) => v.size === sizeLabel);
        if (exists) {
            setEditVariants(editVariants.filter((v: any) => v.size !== sizeLabel));
        } else {
            setEditVariants([
                ...editVariants,
                {
                    size: sizeLabel,
                    stock_quantity: 0,
                }
            ]);
        }
    }

    const handleDeleteProduct = async (productId: number) => {
        try {
            const confirmResult = await Swal.fire({
                title: 'ยืนยันการลบสินค้า',
                text: `คุณต้องการลบสินค้า ${product.product_name} นี้หรือไม่?`,
                icon: 'warning',
                confirmButtonText: 'ยืนยัน',
                confirmButtonColor: '#d33',
                showCancelButton: true,
                cancelButtonColor: '#6B7280',
                cancelButtonText: 'ยกเลิก'
            });
            if (!confirmResult.isConfirmed) return;
            const response = await axios.delete(`/api/staff/product/${productId}`);
            Swal.fire({
                icon: 'success',
                title: response.data.message || 'ลบสินค้าสำเร็จ',
                confirmButtonText: 'ตกลง'
            });
            mutate();
            onClose();
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Delete Product error response:', error.response.data);
                Swal.fire({
                    icon: 'error',
                    title: 'ลบสินค้าไม่สำเร็จ',
                    text: error.response.data.error.message || 'เกิดข้อผิดพลาดในการลบสินค้า',
                    confirmButtonText: 'ตกลง'
                })
                return;
            }
            console.error('Delete Product error:', error);
        }
    }

    const handleEditModeToggle = () => {
        setEditVariants(product?.variants?.map((variant: any) =>
            ({ ...variant, })
        ));
        setIsEditMode(true)
    }

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (product_name && base_price && selectedCategory && selectedGender && editVariants.length >= 0) {
                const confirmResult = await Swal.fire({
                    title: 'ยืนยันการแก้ไขสินค้า',
                    text: `คุณต้องการแก้ไขสินค้านี้หรือไม่?`,
                    icon: 'question',
                    confirmButtonText: 'ยืนยัน',
                    confirmButtonColor: '#3085d6',
                    showCancelButton: true,
                    cancelButtonColor: '#6B7280',
                    cancelButtonText: 'ยกเลิก'
                });
                if (!confirmResult.isConfirmed) return;
            }
            const formData = new FormData();
            formData.append('product_name', product_name);
            formData.append('description', description);
            formData.append('base_price', base_price);
            formData.append('category_id', selectedCategory ? String(selectedCategory.value) : '');
            formData.append('gender_id', selectedGender ? String(selectedGender.value) : '');
            formData.append('is_active', String(is_active));
            formData.append('best_seller', String(best_seller));
            formData.append('variants', JSON.stringify(editVariants));
            if (image) {
                formData.append('image', image);
            }
            const response = await axios.put(`/api/staff/product/${product.product_id}`, formData);
            Swal.fire({
                icon: 'success',
                title: response.data.message || 'อัปเดตสินค้าสำเร็จ',
                confirmButtonText: 'ตกลง'
            });
            setIsEditMode(false);
            mutate();
            onClose();
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Update Product error response:', error.response?.data?.error);
                Swal.fire({
                    icon: 'error',
                    title: 'อัปเดตสินค้าไม่สำเร็จ',
                    text: error.response?.data?.error?.message || 'เกิดข้อผิดพลาดในการอัปเดตสินค้า',
                    confirmButtonText: 'ตกลง'
                });
                return;
            }
            console.error('Update Product error:', error);
        }
    }

    return (
        <div id="staff-product-detail-modal-component">
            <div className="px-4 md:px-0 fixed inset-0 z-40 bg-[rgba(0,0,0,0.4)] flex justify-center items-center">
                <div className="tracking-[.5px] min-w-75 max-w-170 w-full bg-white rounded-[5px] py-4 shadow-xl relative">
                    <div className='flex justify-between items-center border-b border-[#E0E0E0] px-4 pb-4 mb-4'>
                        <div className='flex items-center gap-x-4'>
                            <h2 className=' font-normal text-gray-800'>รายละเอียดสินค้า</h2>
                            {isEditMode && (
                                <p className={`rounded-full w-fit text-xs px-4 py-1 border text-yellow-700 bg-yellow-100  border-yellow-400`} >โหมดแก้ไข</p>
                            )}
                        </div>
                        <button onClick={onClose} className='cursor-pointer p-1.5 bg-[#F3F4F6] rounded-[50%] hover:bg-[#E5E7EB]'>
                            <RxCross2 size={20} color='#454545' />
                        </button>
                    </div>
                    <div className='px-4 font-light tracking-wide overflow-y-auto max-h-[75vh]'>
                        <form action="" onSubmit={handleSave}>
                            <div className={`flex items-start justify-between mb-5`}>
                                <div className='flex items-start gap-x-4'>
                                    {!isEditMode ? (
                                        <div className='relative size-30 border border-gray-300 overflow-hidden shadow'>
                                            {product.image_path ? (
                                                <Image src={product.image_path} alt={product.product_name} fill />
                                            ) : (
                                                <div className='bg-gray-100 size-full absolute flex flex-col justify-center items-center space-y-4'>
                                                    <FaLayerGroup size={30} className=' text-gray-300 ' />
                                                    <p className='text-xs text-gray-500 font-light tracking-wide'>ไม่มีภาพสินค้า</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className='flex flex-col space-y-2'>
                                            <label className='text-xs text-gray-800' htmlFor="">รูปภาพสินค้า</label>
                                            <div className='bg-slate-100 size-30 py-4 border-2 border-dashed border-gray-300 hover:border-gray-500 duration-300 group'>
                                                <div className='flex justify-center items-center h-full'>
                                                    <div
                                                        className={`relative size-40 w-full`}
                                                        style={{ cursor: 'pointer', overflow: 'hidden' }}
                                                    >
                                                        {previewUrl ? (
                                                            <Image src={previewUrl} fill alt="preview" className='absolute object-contain' />
                                                        ) : (
                                                            <div className='flex flex-col items-center justify-center h-full gap-y-2'>
                                                                <PiImagesSquareLight className='text-gray-300 group-hover:text-gray-500 duration-300' size={40} />
                                                                {/* <p className='text-xs text-left text-gray-400 group-hover:text-gray-600 duration-300 tracking-wide'>ลากและวางไฟล์ หรือคลิกเพื่อเลือกไฟล์</p> */}
                                                            </div>
                                                        )}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                                            onChange={handleFileChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className=''>
                                        {!isEditMode ? (
                                            <div className='flex items-center gap-x-4 mb-2'>
                                                <p className={`rounded-full w-fit text-xs px-4 py-0.5 border ${product.is_active ? 'text-green-700 bg-green-200  border-green-500' : 'text-red-700 bg-red-200  border-red-500'}`} >{product.is_active ? 'Active' : 'Inactive'}</p>
                                                <p className='text-xs text-gray-700 border-r border-gray-400 pr-4'>{product.gender_name}</p>
                                                <p className='text-xs text-gray-700'>{product.category_name}</p>
                                            </div>
                                        ) : (
                                            <div className='flex items-start gap-x-4'>
                                                {/* <p className={`rounded-full w-fit text-xs px-4 py-0.5 border ${product.is_active ? 'text-green-700 bg-green-200  border-green-500' : 'text-red-700 bg-red-200  border-red-500'}`} >{product.is_active ? 'Active' : 'Inactive'}</p> */}
                                                <div className='grid grid-cols-2 w-125 gap-x-4'>
                                                    <div className='flex flex-col space-y-2'>
                                                        <label className='text-xs text-gray-700' htmlFor="">
                                                            เพศ
                                                        </label>
                                                        <Select
                                                            className='text-sm'
                                                            value={selectedGender}
                                                            onChange={setSelectedGender}
                                                            options={genderList.map((gender: any) =>
                                                                ({ value: gender.id, label: gender.gender_name })
                                                            )}
                                                        />
                                                    </div>
                                                    <div className='flex flex-col space-y-2'>
                                                        <label className='text-xs text-gray-700' htmlFor="">
                                                            หมวดหมู่
                                                        </label>
                                                        <Select
                                                            className='text-sm'
                                                            value={selectedCategory}
                                                            onChange={setSelectedCategory}
                                                            options={categoryList.map((category: any) =>
                                                                ({ value: category.id, label: category.category_name })
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className='space-y-2'>
                                            {!isEditMode ? (
                                                <h2 className='font-normal text-gray-800'>{product.product_name}</h2>
                                            ) : (
                                                <input value={product_name} onChange={(e) => setProduct_name(e.target.value)} className='w-full border border-gray-300 hover:border-gray-500 text-sm px-4 py-1.5 my-3 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none' type="text" />
                                            )}
                                            <p className='text-xs text-gray-700'>{product.product_code}</p>
                                        </div>
                                    </div>
                                </div>
                                {!isEditMode && (
                                    <div className='flex items-center gap-x-4'>
                                        <button
                                            type='button'
                                            onClick={handleEditModeToggle}
                                            className="cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:border-gray-500 hover:shadow-[0px_0px_10px_#00000014]"
                                        >
                                            <CiEdit className="text-gray-600" size={20} />
                                        </button>
                                        <button
                                            type='button'
                                            onClick={() => handleDeleteProduct(product.product_id)}
                                            className="cursor-pointer size-9 flex justify-center items-center rounded-full border border-gray-300 duration-200 hover:border-gray-500 hover:shadow-[0px_0px_10px_#00000014]"
                                        >
                                            <PiTrashLight className="text-gray-600" size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className='grid grid-cols-2 gap-x-5 mb-5'>
                                <div className='border border-gray-300 bg-gray-50 p-4'>
                                    <p className='text-xs text-gray-700'>ราคา</p>
                                    {!isEditMode ? (
                                        <p className='text-gray-700 font-medium text-xl'>฿ {Number(product.base_price).toLocaleString()}</p>
                                    ) : (
                                        <input value={base_price} onChange={(e) => setBase_price(e.target.value)} className='w-full border border-gray-300 hover:border-gray-500 text-sm px-4 py-1.5 mt-3 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none' type="number" />
                                    )}
                                </div>
                                <div className='border border-gray-300 bg-gray-50 p-4'>
                                    <p className='text-xs text-gray-700'>สต็อกสินค้าทั้งหมด</p>
                                    <p className={`font-medium text-xl ${Number(product.sum_stock_quantity) <= 10 ? 'text-red-600' : 'text-gray-700'}`}>{product.sum_stock_quantity} <span className='text-xs text-gray-700 font-light'>ชิ้น</span></p>
                                </div>
                            </div>
                            <div className='mb-5'>
                                <div className='space-y-2'>
                                    <h2 className='text-xs text-gray-700'>รายละเอียด</h2>
                                    {!isEditMode ? (
                                        <p className='text-sm text-gray-900'>{product.description || 'ยังไม่มีรายละเอียดสินค้า'}</p>

                                    ) : (
                                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} name='description' className="w-full h-20 text-sm border border-gray-300 hover:border-gray-500  p-2 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none" />
                                    )}
                                </div>
                            </div>
                            <div className='mb-5 '>
                                <div>
                                    <h2 className='text-xs text-gray-700 mb-2'>ตัวเลือกสินค้า ( {product?.variants?.length || '0'} )</h2>
                                    {isEditMode && (
                                        <div className='flex items-center gap-x-4 mb-3'>
                                            {presetSizes.map((size, index) => (
                                                <button type='button' key={size} onClick={() => toggleVariantSize(size)} className={`${product?.variants.some((v: any) => v.size === size) ? 'bg-gray-200' : 'bg-gray-50 cursor-pointer  transition-all duration-100 hover:bg-gray-200 active:scale-110'}  size-10  text-sm border-2 font-light border-gray-300 text-gray-600`}>
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <table className='w-full text-left border border-gray-300'>
                                        <thead className='text-gray-500 [&_th]:text-xs [&_th]:font-light bg-gray-100'>
                                            <tr className=''>
                                                <th className='pl-2.5 py-2.5'>SKU</th>
                                                <th className=''>ไซส์</th>
                                                <th className='text-end pr-2.5'>คงเหลือ</th>
                                            </tr>
                                        </thead>
                                        <tbody className='text-gray-700 [&_td]:text-sm [&_td]:font-light [&>tr>td]:py-2.5'>
                                            {!isEditMode ? (
                                                product?.variants?.map((variant: any) => (
                                                    <tr key={variant.id} className='border-b border-gray-300'>
                                                        <td className='pl-2.5'>{variant.sku_code}</td>
                                                        <td className=''>
                                                            <p className='size-8 flex justify-center items-center border text-xs border-gray-300 bg-gray-50'>
                                                                {variant.size}
                                                            </p>
                                                        </td>
                                                        <td className={`text-end pr-2.5 ${Number(variant.stock_quantity) <= 10 && 'text-red-600'}`}>{Number(variant.stock_quantity)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                editVariants?.map((variant: any, index: number) => (
                                                    <tr key={variant.id} className='border-b border-gray-300'>
                                                        <td className='pl-2.5'>{variant.sku_code || 'Auto - Code'}</td>
                                                        <td className=''>
                                                            <p className='size-8 flex justify-center items-center border text-xs border-gray-300 bg-gray-50'>
                                                                {variant.size}
                                                            </p>
                                                        </td>
                                                        <td className='text-end pr-2.5'>
                                                            <input value={variant.stock_quantity}
                                                                onChange={(e) => {
                                                                    const newVariants = [...editVariants];
                                                                    newVariants[index].stock_quantity = Number(e.target.value);
                                                                    setEditVariants(newVariants);
                                                                }}
                                                                className='w-20 border border-gray-300 hover:border-gray-500 text-sm px-4 py-1.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-sm font-light text-gray-600 focus:outline-none' type="number" />
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {isEditMode && (
                                <div className='flex justify-end mb-5 pb-5 border-b border-gray-300 '>
                                    <div className='flex items-center gap-x-6'>
                                        <div className='flex flex-col gap-y-2'>
                                            <label className='text-sm text-gray-700' htmlFor="is_active">สถานะการใช้งาน</label>
                                            <ActiveSwitch checked={is_active} onChange={setIs_active} />
                                        </div>
                                        <div className='flex flex-col gap-y-2'>
                                            <label className='text-sm text-gray-700' htmlFor="best_seller">สินค้าขายดี</label>
                                            <ActiveSwitch checked={best_seller} onChange={setBest_seller} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className=' flex justify-between'>
                                <div className='flex items-center gap-x-5'>
                                    <div className='flex items-center gap-x-2'>
                                        <PiUser size={18} className='text-gray-500' />
                                        <p className='text-xs text-gray-700'>{product.creator_name}</p>
                                    </div>
                                    <div className='flex items-center gap-x-2'>
                                        <GoCalendar size={18} className='text-gray-500' />
                                        <p className='text-xs text-gray-700'>{formatThaiDate(product.created_at)}</p>
                                    </div>
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

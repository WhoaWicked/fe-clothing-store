'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // แนะนำให้ใช้ Link แทน button ถ้าจะลิ้งค์ไปหน้าอื่น
import { GoArrowRight } from "react-icons/go"; // ถ้ายังไม่ได้ลง: npm i react-icons
import { useRouter } from "next/navigation";
import useSWR from 'swr';
import { FaLayerGroup } from 'react-icons/fa';

export default function Page() {
  const router = useRouter(); // ใช้ useRouter สำหรับการนำทาง
  const fetcher = (url: string) => fetch(url).then(res => res.json());
  const params = new URLSearchParams({
    page: '1',
    limit: '4',
  });
  const { data, error, isLoading } = useSWR(`/api/user/product?${params.toString()}`, fetcher);

  return (
    <div id="user-home-page" className='mt-5'> {/* ลบ mt-4 ออกเพื่อให้ชิดขอบบนสุด (แล้วแต่ดีไซน์) */}
      <section className='relative h-[70vh] md:h-[75vh] w-full overflow-hidden group'>

        {/* 1. Background Image */}
        <Image
          src='https://images.unsplash.com/photo-1669264695920-2ee5444378da?q=80&w=1177&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          alt='Minimalist Architecture'
          fill
          // ปรับ opacity เริ่มต้นให้ชัดขึ้นนิดนึง และคง effect grayscale ไว้
          className='object-cover grayscale opacity-90 transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105'
          priority // เพิ่ม priority เพราะเป็นรูปหลักของหน้า
        />

        {/* 2. Overlay Gradient & Content */}
        {/* เอา w-fit ออก เพื่อให้ gradient ไล่ระดับเต็มพื้นที่ด้านซ้าย */}
        <div className='absolute inset-0 flex flex-col justify-center px-8 md:px-20 bg-gradient-to-r from-white/95 via-white/60 to-transparent/10'>
          <div className='max-w-2xl'>

            {/* Tagline เล็กๆ ด้านบน */}
            <p className="text-sm tracking-[0.3em] uppercase text-gray-500 font-medium mb-4 relative left-1">
              New Arrival
            </p>

            {/* Headline เล่นระดับความหนา-บาง */}
            <h1 className='text-5xl md:text-7xl text-black font-extrabold leading-tight tracking-tight'>
              SIMPLICITY <br />
              <span className="font-light text-gray-600">REDEFINED.</span>
            </h1>

            {/* Subtitle ปรับให้อ่านสบายตาขึ้น */}
            <p className='mt-6 text-gray-700 text-lg md:text-xl font-light max-w-lg leading-relaxed'>
              ความเรียบง่ายที่ลงตัว ยกระดับลุคของคุณในทุกวัน ด้วยดีไซน์ที่ใส่ใจในทุกรายละเอียด
            </p>

            {/* Premium Button */}
            <div className="mt-10">
              {/* แนะนำให้ใช้ Link ถ้าจะกดแล้วไปหน้าอื่น */}
              <button type='button' onClick={() => router.push('/user/product')} className='group/btn flex items-center gap-3 bg-black text-white px-8 py-4 text-sm font-light tracking-widest uppercase border border-black transition-all duration-200 active:scale-90 cursor-pointer'>
                Shop Collection
                {/* ไอคอนลูกศรขยับเมื่อ hover ปุ่ม */}
                <GoArrowRight className="group-hover/btn:translate-x-2 transition-transform duration-300" size={18} />
              </button>
            </div>

          </div>
        </div>
      </section>
      <div className="w-full py-4 bg-neutral-900 border-t border-b border-gray-800 text-white overflow-hidden">

        {/* Container หลัก: ต้องมี flex เพื่อให้ข้อความ 2 ชุดเรียงต่อกัน */}
        <div className="flex w-full whitespace-nowrap group">

          {/* --- ชุดที่ 1 (ตัววิ่งหลัก) --- */}
          {/* animate-marquee: สั่งให้วิ่ง */}
          {/* min-w-full: ยืดให้เต็มจอเสมอ */}
          <div className="animate-marquee flex min-w-full justify-around items-center py-2">
            <span className="text-xs md:text-sm tracking-[0.3em] font-medium mx-12 text-gray-400 uppercase">New Collection</span>
            <span className="text-xs md:text-sm tracking-[0.3em] font-medium mx-12 text-gray-400 uppercase">Free Worldwide Shipping</span>
            <span className="text-xs md:text-sm tracking-[0.3em] font-bold mx-12 text-white uppercase italic">Sale 50% Off</span>
            <span className="text-xs md:text-sm tracking-[0.3em] font-medium mx-12 text-gray-400 uppercase">Limited Edition</span>
          </div>

          {/* --- ชุดที่ 2 (ตัววิ่งสำรอง - สำคัญมาก!) --- */}
          {/* ต้องเหมือนชุดที่ 1 เป๊ะๆ เพื่อให้ตอนวนลูปมันเนียน */}
          <div className="animate-marquee flex min-w-full justify-around items-center py-2">
            <span className="text-xs md:text-sm tracking-[0.3em] font-medium mx-12 text-gray-400 uppercase">New Collection</span>
            <span className="text-xs md:text-sm tracking-[0.3em] font-medium mx-12 text-gray-400 uppercase">Free Worldwide Shipping</span>
            <span className="text-xs md:text-sm tracking-[0.3em] font-bold mx-12 text-white uppercase italic">Sale 50% Off</span>
            <span className="text-xs md:text-sm tracking-[0.3em] font-medium mx-12 text-gray-400 uppercase">Limited Edition</span>
          </div>

        </div>
      </div>
      <section className="container mx-auto px-4 mt-24">
        <div className="text-center mb-16">
           <span className="text-xs font-bold tracking-[0.3em] text-gray-400 uppercase block mb-4">Discover</span>
           <h2 className="text-4xl md:text-5xl font-light uppercase tracking-[0.1em] text-gray-900">Curated Looks</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 h-[600px] md:h-[800px]">

          {/* รูปใหญ่ด้านซ้าย (กินพื้นที่ 2 คอลัมน์ 2 แถว) */}
          <div className="col-span-2 row-span-2 relative group overflow-hidden cursor-pointer">
            <Image
              src="https://images.unsplash.com/photo-1716541425064-b07b68f436de?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Main Look"
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out group-hover:scale-105"
            />
             <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            <div className="absolute bottom-8 left-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0">
               <h3 className="text-2xl font-normal tracking-widest uppercase mb-1">Urban Minimalist</h3>
               <p className="text-xs text-gray-300 tracking-wider">View Collection</p>
            </div>
          </div>

          {/* รูปเล็กขวาบน */}
          <div className="relative group overflow-hidden cursor-pointer">
            <Image
              src="https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=600&auto=format&fit=crop"
              alt="Detail"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          </div>

          {/* รูปเล็กขวาบน (2) */}
          <div className="relative group overflow-hidden bg-neutral-50 flex items-center justify-center p-8 border border-gray-100 hover:border-black transition-colors duration-300">
            <div className="text-center z-10">
              <h3 className="text-6xl font-black uppercase tracking-tighter mb-0 italic leading-none">Sale</h3>
              <p className="text-gray-500 text-xs mb-8 tracking-[0.2em] uppercase mt-2">Up to 50% Off</p>
              <button onClick={() => router.push('/user/product')} className="group-hover:bg-black group-hover:text-white px-8 py-3 border border-black text-xs font-bold uppercase transition-all duration-300 tracking-widest">
                Shop Now
              </button>
            </div>
          </div>

          {/* รูปยาวขวาล่าง (กินพื้นที่ 2 คอลัมน์) */}
          <div className="col-span-2 relative group overflow-hidden cursor-pointer">
            <Image
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop"
              alt="Texture"
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-90"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all duration-500">
              <div className="border border-white/30 px-12 py-6 backdrop-blur-sm group-hover:border-white transition-all duration-500">
                <h2 className="text-white text-xl md:text-3xl font-light tracking-[0.4em] uppercase shadow-black drop-shadow-lg">Accessories</h2>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* --- SECTION 4: SELECTED ITEMS (สินค้าแนะนำ) --- */}
      <section className="container mx-auto px-4 mt-20 border-b border-gray-200">

        {/* Header ของ Section */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase block mb-2">
              Selected for You
            </span>
            <h2 className="text-3xl md:text-4xl font-normal uppercase tracking-tight">
              สินค้าใหม่แนะนำ
            </h2>
          </div>
          <Link href="/user/product" className="hidden md:flex items-center gap-2 text-sm font-normal uppercase tracking-widest hover:underline decoration-1 underline-offset-8">
            ดูสินค้าทั้งหมด <GoArrowRight />
          </Link>
        </div>

        {/* Product Grid */}
        <div className='grid grid-cols-4 gap-x-6 gap-y-10 mb-15'>
          {data?.products.map((product: any) => {
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
        </div>

        {/* ปุ่มดูทั้งหมด (มือถือ) */}
        <div className="mt-12 flex justify-center md:hidden">
          <Link href="/shop" className="w-full py-4 border border-black text-center text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
            ดูสินค้าทั้งหมด
          </Link>
        </div>
      </section>
      {/* --- SECTION 5: NEWSLETTER (สมัครสมาชิก) --- */}
      {/* ใช้พื้นหลังดำเพื่อตัดอารมณ์ และเน้นความ Exclusive */}
      <section className=" text-black mt-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">

          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
            Join the Movement
          </h2>
          <p className="text-gray-400 text-base font-light mb-10 max-w-xl mx-auto">
            อย่าพลาดคอลเลกชันใหม่และโปรโมชั่นพิเศษก่อนใคร สมัครสมาชิกวันนี้รับส่วนลดทันที 10%
          </p>

          <form className="flex flex-col md:flex-row gap-4 justify-center items-center w-full">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full md:w-96 bg-transparent border-b border-gray-600 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors text-center md:text-left"
            />
            <button
              type="submit"
              className="bg-black text-white px-10 py-3 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors w-full md:w-auto"
            >
              Subscribe
            </button>
          </form>

          <p className="text-gray-600 text-xs mt-6 font-light">
            By subscribing, you agree to our Privacy Policy and Terms of Use.
          </p>
        </div>
      </section>

    </div>
  )
}
'use client';
import React, { useState } from 'react';
import { 
  ThailandAddressTypeahead, 
  ThailandAddressValue 
} from 'react-thailand-address-typeahead';

export default function AddressForm() {
  // 1. State สำหรับช่อง "พิมพ์แล้วเด้ง" (ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์)
  const [address, setAddress] = useState<ThailandAddressValue>(
    ThailandAddressValue.empty()
  );

  // 2. State สำหรับช่องพิมพ์ธรรมดา (บ้านเลขที่, ถนน)
  const [houseDetail, setHouseDetail] = useState({
    houseNumber: '',
    street: ''
  });

  // สไตล์ CSS เรียบๆ สไตล์ Minimal
  const inputStyle = "w-full border-b border-gray-300 py-3 focus:outline-none focus:border-black text-sm bg-transparent transition-colors";

  // ฟังก์ชันเวลากดปุ่ม Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันหน้าเว็บรีเฟรช

    // 3. รวมข้อมูลทั้งหมดเตรียมส่ง API
    const dataForAPI = {
      address_line1: houseDetail.houseNumber,
      street: houseDetail.street,
      subdistrict: address.subdistrict,
      district: address.district,
      province: address.province,
      zipcode: address.postalCode // ข้อควรระวัง: Library ใช้คำว่า postalCode
    };

    console.log("ข้อมูลที่พร้อมส่ง:", dataForAPI);
    alert("ลองเปิด Console ดูข้อมูลที่จัดเตรียมไว้ครับ!");
  };

  return (
    <form onSubmit={handleSave} className="max-w-lg p-8 border border-gray-200 mt-8 mx-auto">
      <h2 className="text-xl font-bold uppercase tracking-widest mb-6">Shipping Address</h2>
      
      <div className="space-y-6">
        
        {/* --- ส่วนที่ 1: พิมพ์เองธรรมดา --- */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">บ้านเลขที่ / หมู่</label>
            <input 
              type="text" 
              className={inputStyle} 
              placeholder="เช่น 123/45"
              value={houseDetail.houseNumber}
              onChange={(e) => setHouseDetail({...houseDetail, houseNumber: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">ถนน / ซอย</label>
            <input 
              type="text" 
              className={inputStyle} 
              placeholder="เช่น สุขุมวิท 71"
              value={houseDetail.street}
              onChange={(e) => setHouseDetail({...houseDetail, street: e.target.value})}
            />
          </div>
        </div>

        {/* --- ส่วนที่ 2: ระบบพิมพ์แล้วเด้ง (Auto-complete) --- */}
        <div className="relative">
          <ThailandAddressTypeahead
            value={address}
            onValueChange={(val) => setAddress(val)} // เมื่อมีการเลือก ข้อมูลจะวิ่งเข้า State อัตโนมัติ
          >
            <div className="grid grid-cols-2 gap-4">
              
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">แขวง / ตำบล</label>
                {/* ต้องใช้ Input ของ Library เท่านั้น */}
                <ThailandAddressTypeahead.SubdistrictInput className={inputStyle} />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">เขต / อำเภอ</label>
                <ThailandAddressTypeahead.DistrictInput className={inputStyle} />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">จังหวัด</label>
                <ThailandAddressTypeahead.ProvinceInput className={inputStyle} />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">รหัสไปรษณีย์</label>
                <ThailandAddressTypeahead.PostalCodeInput className={inputStyle} />
              </div>

            </div>

            {/* กล่อง Dropdown ที่จะเด้งขึ้นมา (จัดตำแหน่งด้วย absolute) */}
            <ThailandAddressTypeahead.Suggestion 
              containerProps={{ 
                className: "absolute z-50 w-full bg-white border border-gray-200 shadow-xl mt-1 max-h-60 overflow-y-auto text-sm" 
              }} 
            />
          </ThailandAddressTypeahead>
        </div>

      </div>

      <button 
        type="submit" 
        className="w-full mt-10 bg-black text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors"
      >
        Save Address
      </button>

    </form>
  );
}
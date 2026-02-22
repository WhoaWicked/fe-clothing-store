'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const AddressList = dynamic(
    () => import('@/components/user/Address').then((mod) => mod.AddressList),
    { ssr: false } // <--- พระเอกของเราคือบรรทัดนี้ครับ
);

export default function Page() {
    return (
        <div id="user-address-page">
            <AddressList />
        </div>
    )
}
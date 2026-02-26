'use client';
import React from 'react'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import dynamic from 'next/dynamic';
const Checkout = dynamic(
    () => import('@/components/user/Checkout').then(mod => mod.Checkout),
    { ssr: false }
);


export default function page() {
    return (
        <div id="user-checkout-page" >
            <Checkout />
        </div>
    )
}

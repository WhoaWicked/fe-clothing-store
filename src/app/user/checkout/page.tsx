'use client';
import React from 'react'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Checkout } from '@/components/user/Checkout';


export default function page() {
    return (
        <div id="user-checkout-page" >
            <Checkout />
        </div>
    )
}

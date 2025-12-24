'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ProductByCode } from '@/components/user/ProductByCode';



export default function Page() {
    return (
        <div id="product-by-code-page">
            <ProductByCode />
        </div>
    )
}

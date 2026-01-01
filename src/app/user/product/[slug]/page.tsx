'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ProductByCode } from '@/components/user/ProductByCode';
import { ReviewList } from '@/components/user/Review';



export default function Page() {
    return (
        <div id="product-by-code-page">
            <ProductByCode />
            <ReviewList />
        </div>
    )
}

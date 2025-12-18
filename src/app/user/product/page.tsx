'use client';
import React from 'react'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Products } from '@/components/user/product/product';

export default function page() {
    return (
        <div id="user-product-page">
            <Products />
        </div>
    )
}

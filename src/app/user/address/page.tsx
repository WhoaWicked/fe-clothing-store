'use client';
import React, { useState, useEffect } from 'react';
import { AddressList } from '@/components/user/Address';

export default function Page() {
    return (
        <div id="user-address-page">
            <AddressList />
        </div>
    )
}
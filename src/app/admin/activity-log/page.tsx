'use client';
import React, { useState, useEffect } from "react";
import { ActivityLog } from "@/components/admin/ActivityLog";

export default function Page() {
    return (
        <div id='admin-manage-user-page' className='p-6'>
            <div className='mb-10'>
                <div className="flex items-center gap-x-3 mb-2">
                    <h1 className="text-gray-800 text-3xl font-light">บันทึกกิจกรรม</h1>
                    <div className="mt-1 w-12 h-0.75 bg-gray-600"></div>
                </div>
                <p className='font-light text-gray-500'>ดูแลจัดการรายการบันทึกกิจกรรมในระบบของคุณได้ที่นี่</p>
            </div>

            <div className='mt-6'>
                <ActivityLog />
            </div>
        </div>
    )
}


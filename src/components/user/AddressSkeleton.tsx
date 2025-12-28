import { FC } from 'react';

export const AddressSkeleton: FC<{ loop: number }> = ({ loop }) => {
    return (
        <div className='space-y-5 w-105'>
            {Array.from({ length: loop }).map((_, index) => (
                <div key={index} className='rounded border border-gray-300 p-5 shadow-sm'>
                    <div className='flex justify-between items-center mb-5'>
                        <div className='h-4 bg-gray-300 animate-pulse w-1/4 rounded'></div>
                        <div className='flex items-center gap-x-3'>
                            <div className='h-4 bg-gray-300 animate-pulse rounded w-5'></div>
                            <div className='h-4 bg-gray-300 animate-pulse rounded w-5'></div>
                        </div>
                    </div>
                    <div>
                        <div className='h-3 bg-gray-200 animate-pulse rounded w-1/3 mb-3'></div>
                        <div className='h-3 bg-gray-200 animate-pulse rounded w-full '></div>
                    </div>
                </div>
            ))}
        </div>
    )
}
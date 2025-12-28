import { FC } from 'react';

export const OrderListSkeleton: FC<{ loop: number }> = ({ loop }) => {
    return (
        <div className='mt-5 mb-10 space-y-5'>
            {Array.from({ length: loop }).map((_, index) => (
                <div key={index}>
                    <div className='border border-gray-300 shadow-md'>
                        <div className='border-b border-gray-300 p-4 flex justify-between'>
                            <div>
                                <div className='h-5 bg-gray-200 animate-pulse rounded w-80 mb-4'></div>
                                <div className='flex items-center gap-x-4'>
                                    <div className='h-3.5 bg-gray-200 animate-pulse rounded w-7'></div>
                                    <div className='h-3.5 bg-gray-200 animate-pulse rounded w-50'></div>
                                </div>
                            </div>
                            <div className='flex items-center gap-x-10'>
                                <div className='h-6 bg-gray-300 animate-pulse rounded-full w-20'>

                                </div>
                                <div className='flex flex-col items-end'>
                                    <div className='h-3 bg-gray-200 animate-pulse rounded w-15 mb-4'></div>
                                    <div className='h-4 bg-gray-300 animate-pulse rounded w-15'></div>
                                </div>
                            </div>
                        </div>



                        <div className='border-b border-gray-300 p-4 flex justify-between items-end'>
                            <div className='flex items-stretch gap-x-4'>
                                <div className='size-35 bg-gray-200 animate-pulse rounded '></div>
                                <div className='flex flex-col justify-between items-start'>
                                    <div>
                                        <div className='h-3 bg-gray-200 animate-pulse rounded w-40 mb-5'></div>
                                        <div className='h-3 bg-gray-200 animate-pulse rounded w-15 mb-3'></div>
                                        <div className='h-5 bg-gray-200 animate-pulse rounded w-20 mb-3'></div>
                                    </div>
                                    <div>
                                        <div className='h-3 bg-gray-200 animate-pulse rounded w-6'></div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='h-3 bg-gray-200 animate-pulse rounded w-90 '></div>
                            </div>
                        </div>



                        <div className='flex justify-between items-center p-4'>
                            <div className='h-3 bg-gray-200 animate-pulse rounded w-35'></div>
                            <div className='h-9 bg-gray-200 animate-pulse rounded w-28'></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
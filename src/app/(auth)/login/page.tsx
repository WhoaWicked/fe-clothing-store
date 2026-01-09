'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PiShoppingBagLight, PiUser } from "react-icons/pi";
import { SlLock } from "react-icons/sl";
import Swal, { SweetAlertIcon } from "sweetalert2";
import axios from "axios";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const swalAuthAlert = async (status: number, serverMessage: string) => {
        let icon: SweetAlertIcon = 'error';
        const title = 'ไม่สามารถเข้าสู่ระบบได้';
        const text = serverMessage || 'เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง';
        if (status === 400) {
            icon = 'warning';
        } else if (status === 401) {
            icon = 'error';
        }
        await Swal.fire({
            icon,
            title,
            text,
            confirmButtonColor: icon === "warning" ? "#FFC107" : "#d33",
            confirmButtonText: 'ตกลง'
        });
    }
    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            const response = await axios.post('/api/auth/login', { email, password });
            const result = response.data;
            function getRoleFromToken(token: string) {
                const payload = token.split('.')[1];
                const decoded = JSON.parse(atob(payload));
                return decoded.role;
            }
            const role = getRoleFromToken(result.access_token);
            if (role === 'user') {
                router.push('/user');
            } else if (role === 'staff') {
                router.push('/staff');
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error("Login error:", error.response.data.error.message);
                await swalAuthAlert(error.response.status, error.response.data.error.message);
            } else {
                console.error("Login error:", error);
            }
        }
    }

    return (
        <div id="login-page">
            <div className="h-screen grid grid-cols-[2fr_1fr]">
                <div className="bg-gray-300"></div>
                <div className="flex items-center justify-center">
                    <div className="px-8 flex flex-col justify-center w-full">
                        <div className="mb-10">
                            <div className="mb-5">
                                <PiShoppingBagLight className="text-gray-700 mx-auto" size={80} />
                            </div>
                            <div className="flex items-center justify-center gap-x-4 mb-5">
                                <h1 className="text-gray-700 text-4xl font-light">Clothing Store</h1>
                                <div className="mt-2 w-15 h-0.75 bg-gray-600"></div>
                            </div>
                            <div>
                                <h2 className="text-gray-600 text-2xl font-light text-center tracking-wide">ยินดีต้อนรับกลับมา !</h2>
                            </div>
                        </div>
                        <div>
                            <form action="" onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-y-2">
                                        <label htmlFor="email" className="text-sm tracking-wide text-gray-600 font-light">
                                            บัญชีผู้ใช้
                                        </label>
                                        <div className="flex items-center gap-x-4 border border-gray-300  px-4 py-2.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-md">
                                            <PiUser className="text-gray-400" size={20} />
                                            <input onChange={(e) => setEmail(e.target.value)} type="text" className="font-light w-full tracking-wide text-gray-600 focus:outline-none" placeholder="เช่น clothing@gmail.com" autoFocus />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-y-2">
                                        <label htmlFor="password" className="text-sm tracking-wide text-gray-600 font-light">
                                            รหัสผ่าน
                                        </label>
                                        <div className="flex items-center gap-x-4 border border-gray-300  px-4 py-2.5 duration-300 focus-within:ring-1 focus-within:ring-gray-500 shadow-md">
                                            <SlLock className="text-gray-400" size={20} />
                                            <input onChange={(e) => setPassword(e.target.value)} type="password" className="font-light w-full tracking-wide text-gray-600 focus:outline-none" placeholder="รหัสผ่าน" />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="w-fit cursor-pointer text-sm font-light text-blue-600">ลืมรหัสผ่าน</p>
                                            <p className="w-fit cursor-pointer text-sm font-light text-gray-700">สมัครสมาชิก</p>
                                        </div>
                                    </div>

                                    <div className="bg-black  duration-300 shadow-md cursor-pointer hover:shadow-lg hover:scale-105">
                                        <button type="submit" className="p-3 text-center text-sm w-full cursor-pointer  font-light text-white tracking-wide">เข้าสู่ระบบ</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

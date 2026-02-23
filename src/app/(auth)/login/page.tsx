'use client';
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PiScissorsLight, PiShoppingBagLight, PiUser } from "react-icons/pi";
import { SlLock } from "react-icons/sl";
import Swal, { SweetAlertIcon } from "sweetalert2";
import axios from "axios";
import { signIn, getSession, useSession } from "next-auth/react";
import Image from "next/image";

export default function Login() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleRedirectByRole = useCallback((role: string) => {
        switch (role) {
            case 'user': router.push("/user/product"); break;
            case 'staff': router.push("/staff/order"); break;
            case 'admin': router.push("/admin/activity-log"); break;
        }
        router.refresh();
    }, [router]);

    useEffect(() => {
        if (status === 'authenticated' && session?.user.role) {
            handleRedirectByRole(session.user.role);
        }
    }, [session, status, handleRedirectByRole]);

    if (status === 'authenticated' && session?.user.role) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4">
                <div className="size-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin">
                </div>
                <p className="text-gray-500 text-sm">กำลังเข้าสู่ระบบ . . .</p>
            </div>
        );
    }

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
            const response = await signIn("credentials", {
                email,
                password,
                redirect: false
            });
            if (response?.error) {
                console.error("Login error:", response.error);
                await swalAuthAlert(401, response.error);
            } else {
                const session = await getSession();
                if (session?.user.role) {
                    handleRedirectByRole(session.user.role);
                }
            }
        } catch (error: unknown) {
            console.error('Login error:', error);
        }
    }
    const handleGoogleLogin = async () => {
        // try {
        //     const response = await signIn('google', { redirect: false });
        //     if (response?.error) {
        //         console.error('Google Login error:', response.error);
        //         await swalAuthAlert(401, response.error);
        //     } else {
        //         const session = await getSession();
        //         if (session?.user.role) {
        //             handleRedirectByRole(session.user.role);
        //         }
        //     }
        // } catch (error: unknown) {
        //     console.error('Google Login error:', error);
        // }
        try {
            await signIn('google', { callbackUrl: '/' });
        } catch (error: unknown) {
            console.error('Google Login error:', error);
        }
    }
    return (
        <div id="login-page">
            {/* <div className="h-screen grid grid-cols-[2fr_1fr]">
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
            </div> */}
            <div className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute grayscale-100 inset-0 bg-[url('https://images.unsplash.com/photo-1751738567808-6affa516fedc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-center bg-cover"
                >
                </div>
                <div className="relative z-10 bg-white border border-gray-300 p-8 rounded-lg shadow-lg w-120">
                    <div className=" flex flex-col justify-center w-full">
                        <div className="mb-10">
                            <div className="mb-5">
                                <PiScissorsLight className="text-gray-700 mx-auto" size={50} />
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

                                    <div className="bg-black  duration-300 shadow-md cursor-pointer hover:shadow-lg hover:scale-105 active:scale-95">
                                        <button type="submit" className="p-3 text-center text-sm w-full cursor-pointer  font-light text-white tracking-wide ">เข้าสู่ระบบ</button>
                                    </div>
                                    <div className="flex items-center gap-x-3">
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                        <span className="text-xs text-gray-400 font-light">หรือ</span>
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                    </div>

                                    {/* Google Login Button */}
                                    <button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        className="cursor-pointer w-full flex items-center justify-center gap-x-3 border border-gray-300 px-4 py-2.5 shadow-md duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
                                    >
                                        <Image
                                            src="https://www.google.com/favicon.ico"
                                            alt="Google"
                                            width={20}
                                            height={20}
                                        />
                                        <span className="text-sm font-light text-gray-600 tracking-wide">
                                            เข้าสู่ระบบด้วย Google
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

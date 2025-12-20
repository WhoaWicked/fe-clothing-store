import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
    try {
        const { email, password }
            : { email: string; password: string } = await req.json();
        const loginApi = process.env.LOGIN_API as string;
        const response = await axios.post(loginApi, { email, password });
        const result = response.data;
        const res = NextResponse.json(result.data, { status: 200 });
        res.cookies.set("token", result.data.access_token, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 2, // 2 days
            // sameSite: 'lax',
        });
        return res;
    } catch (error: unknown) {
        console.error("Login API error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from 'next-auth';
import { authOptions } from "../../../../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
    try {
        // const session = await getServerSession(authOptions);
        const session = await getServerSession(authOptions);
        const token = session?.user.accessToken;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const filterCategoryApi = process.env.USER_GET_CATEGORY_FILTER_API as string;
        const response = await axios.get(filterCategoryApi, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error: unknown) {
        console.error("Get Category List error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
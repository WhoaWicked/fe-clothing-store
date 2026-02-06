import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from 'next-auth';
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.user.accessToken;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page');
        const limit = searchParams.get('limit');
        const search_global = searchParams.get('search_global') || undefined;
        const status_name = searchParams.get('status_name') || undefined;
        const start_date = searchParams.get('start_date') || undefined;
        const end_date = searchParams.get('end_date') || undefined;
        const sort_type = searchParams.get('sort_type') || undefined;
        const getOrderListApi = process.env.STAFF_GET_ORDER_LIST_API as string;
        const response = await axios.get(getOrderListApi, {
            params: {
                page,
                limit,
                search_global,
                status_name,
                start_date,
                end_date,
                sort_type
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error: unknown) {
        console.error("Get Order List error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
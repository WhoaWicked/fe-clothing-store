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
        const sort_type = searchParams.get('sort_type') || undefined;
        const action = searchParams.get('action') || undefined;
        const role_name = searchParams.get('role_name') || undefined;
        const start_date = searchParams.get('start_date') || undefined;
        const end_date = searchParams.get('end_date') || undefined;
        const is_success = searchParams.get('is_success') || undefined;
        const getLogListApi = process.env.ADMIN_GET_LOG_LIST_API as string;
        const response = await axios.get(getLogListApi, {
            params: {
                page,
                limit,
                search_global,
                sort_type,
                action,
                role_name,
                is_success,
                start_date,
                end_date,
            },
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error: unknown) {
        console.error("Get Activity Logs error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
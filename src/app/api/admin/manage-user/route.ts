import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { searchParams } = new URL(req.url);
        const page = searchParams.get('page');
        const limit = searchParams.get('limit');
        const search_global = searchParams.get('search_global') || undefined;
        const sort_type = searchParams.get('sort_type') || undefined;
        const getUserListApi = process.env.ADMIN_GET_USER_LIST_API as string;
        const response = await axios.get(getUserListApi, {
            params: {
                page,
                limit,
                search_global,
                sort_type
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error: unknown) {
        console.error("Get User List error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { role_id, prefix_id, username, password, first_name, last_name, email, phone } = await req.json();
        const createUserApi = process.env.ADMIN_CREATE_USER_API as string;
        const response = await axios.post(createUserApi, {
            role_id,
            prefix_id,
            username,
            password,
            first_name,
            last_name,
            email,
            phone
        }, { headers: { Authorization: `Bearer ${token}` } });
        const result = response.data;
        return NextResponse.json(result, { status: 201 });
    } catch (error: unknown) {
        console.error("Create User error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
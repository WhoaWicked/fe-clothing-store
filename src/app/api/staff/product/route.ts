import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page");
        const limit = searchParams.get("limit");
        const product_name = searchParams.get("product_name") || undefined;
        const product_code = searchParams.get("product_code") || undefined;
        const category_name = searchParams.get("category_name") || undefined;
        const gender_name = searchParams.get("gender_name") || undefined;
        const getProductListApi = process.env.STAFF_GET_PRODUCT_LIST_API as string;
        const response = await axios.get(getProductListApi, {
            params: {
                page,
                limit,
                product_name,
                product_code,
                category_name,
                gender_name
            },
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error: unknown) {
        console.error("Get Product List error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const formData = await request.formData();
        const createProductApi = process.env.STAFF_CREATE_PRODUCT_API as string;
        const response = await axios.post(createProductApi, formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error: unknown) {
        console.error("Create Product error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from 'next-auth';
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.user.accessToken;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { code } = await params;
        const getProductByProductCodeApi = process.env.USER_GET_PRODUCT_BY_PRODUCT_CODE_API as string;
        const apiUrl = getProductByProductCodeApi.replace("{productCode}", code);
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error: unknown) {
        console.error("Get Product By Code error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
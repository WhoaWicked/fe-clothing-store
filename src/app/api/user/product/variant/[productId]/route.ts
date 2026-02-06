import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from "../../../../auth/[...nextauth]/route";

export async function GET(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.user.accessToken;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { productId } = await params;
        const getProductVariantByProductIdApi = process.env.USER_GET_PRODUCT_VARIANT_BY_PRODUCT_ID_API as string;
        const apiUrl = getProductVariantByProductIdApi.replace("{productId}", productId);
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error: unknown) {
        console.error("Get Product Variant By Product ID error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { id } = await params;
        const shippedOrderApi = process.env.STAFF_SHIPPED_ORDER_API as string;
        const apiUrl = shippedOrderApi.replace("{orderId}", id);
        const response = await axios.patch(apiUrl, null, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = response.data;
        return NextResponse.json(result, { status: response.status });
    } catch (error: unknown) {
        console.error("Update Status Shipped Order error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
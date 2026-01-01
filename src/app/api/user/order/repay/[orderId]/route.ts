import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าใช้งาน" }, { status: 401 });
        }
        const { orderId } = await params;
        const repayOrderApi = process.env.USER_REPAY_ORDER_API as string;
        const apiUrl = repayOrderApi.replace("{orderId}", orderId);
        const response = await axios.post(apiUrl, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error: unknown) {
        console.error("Repay Order error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
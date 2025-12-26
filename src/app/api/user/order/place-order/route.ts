import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าใช้งาน" }, { status: 401 });
        }
        const { shippingAddress } = await req.json();
        const placeOrderApi = process.env.USER_PLACE_ORDER_API as string;
        const response = await axios.post(placeOrderApi, { shippingAddress }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error: unknown) {
        console.error("Post Place Order error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
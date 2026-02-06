import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from 'next-auth';
import { authOptions } from "../../../auth/[...nextauth]/route";


export async function PUT(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.user.accessToken;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าใช้งาน" }, { status: 401 });
        }
        const { orderId } = await params;
        console.log("Order ID to cancel:", orderId);
        const { cancelledReason } = await req.json();
        console.log("Cancellation reason:", cancelledReason);
        const cancelledOrderApi = process.env.USER_CANCEL_ORDER_API as string;
        const apiUrl = cancelledOrderApi.replace("{orderId}", orderId);
        const response = await axios.put(apiUrl, {
            cancelledReason
        }, { headers: { Authorization: `Bearer ${token}` } });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error: unknown) {
        console.error("Cancel order error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
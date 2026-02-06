import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.user.accessToken;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { id } = await params;
        const deliveredOrderApi = process.env.STAFF_DELIVERED_ORDER_API as string;
        const apiUrl = deliveredOrderApi.replace("{orderId}", id);
        const response = await axios.patch(apiUrl, null, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = response.data;
        return NextResponse.json(result, { status: response.status });
    } catch (error: unknown) {
        console.error("Update Status Delivered Order error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
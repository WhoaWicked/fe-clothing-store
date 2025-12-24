import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ cartItemId: string }> }) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { cartItemId } = await params;
        const { newQuantity } = await req.json();
        const updateQuantityCartApi = process.env.USER_UPDATE_CART_ITEMS_API as string;
        const apiUrl = updateQuantityCartApi.replace("{cartItemId}", cartItemId);
        const response = await axios.put(apiUrl, {
            newQuantity
        }, { headers: { Authorization: `Bearer ${token}` } });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error: unknown) {
        console.error("Update Quantity Cart items error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ cartItemId: string }> }) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { cartItemId } = await params;
        const deleteCartApi = process.env.USER_DELETE_CART_ITEMS_API as string;
        const apiUrl = deleteCartApi.replace("{cartItemId}", cartItemId);
        console.log('cartItemId to delete:', cartItemId);
        console.log('apiUrl:', apiUrl);
        const response = await axios.delete(apiUrl, { headers: { Authorization: `Bearer ${token}` } });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error: unknown) {
        console.error("Delete Cart items error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
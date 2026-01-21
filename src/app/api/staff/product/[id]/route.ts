import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { id } = await params;
        const formData = await request.formData();
        const updateProductApi = process.env.STAFF_UPDATE_PRODUCT_API as string;
        const apiUrl = updateProductApi.replace("{productId}", id);
        const response = await axios.put(apiUrl, formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error: unknown) {
        console.error("Update Product Info error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { id } = await params;
        const deleteProductApi = process.env.STAFF_DELETE_PRODUCT_API as string;
        const apiUrl = deleteProductApi.replace("{productId}", id);
        const response = await axios.delete(apiUrl, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error: unknown) {
        console.error("Delete Product error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { id } = await params;
        const { is_active } = await request.json();
        const updateProductStatusApi = process.env.STAFF_UPDATE_PRODUCT_STATUS_API as string;
        const apiUrl = updateProductStatusApi.replace("{productId}", id);
        const response = await axios.patch(apiUrl,
            { is_active },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error: unknown) {
        console.error("Update Product Status error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { id } = await params;
        const getProductByIdApi = process.env.STAFF_GET_PRODUCT_BY_ID_API as string;
        const apiUrl = getProductByIdApi.replace("{productId}", id);
        const response = await axios.get(apiUrl, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error: unknown) {
        console.error("Get Product by id error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
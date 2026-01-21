import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { id } = await params;
        const getCategoryByIdApi = process.env.STAFF_GET_CATEGORY_BY_ID_API as string;
        const apiUrl = getCategoryByIdApi.replace("{categoryId}", id);
        const response = await axios.get(apiUrl, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error: unknown) {
        console.error("Get Category by id error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { id } = await params;
        const { category_name, is_active } = await request.json();
        const updateCategoryApi = process.env.STAFF_UPDATE_CATEGORY_API as string;
        const apiUrl = updateCategoryApi.replace("{categoryId}", id);
        const response = await axios.put(apiUrl, { category_name, is_active }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error: unknown) {
        console.error("Update Category by id error:", error);
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
        const deleteCategoryApi = process.env.STAFF_DELETE_CATEGORY_API as string;
        const apiUrl = deleteCategoryApi.replace("{categoryId}", id);
        const response = await axios.delete(apiUrl, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error: unknown) {
        console.error("Delete Category by id error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
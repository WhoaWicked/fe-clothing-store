import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from 'next-auth';
import { authOptions } from "../../auth/[...nextauth]/route";


export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.user.accessToken;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId") || '';
        const sortType = searchParams.get("sortType") || '';
        const getReviewListApi = process.env.USER_GET_REVIEW_LIST_API as string;
        const apiUrl = getReviewListApi.replace("{productId}", productId);
        const response = await axios.get(apiUrl, {
            params: { sort: sortType },
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error: unknown) {
        console.error("Get Review List error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.user.accessToken;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { productId, rating, comment } = await req.json();
        const createReviewApi = process.env.USER_CREATE_REVIEW_API as string;
        const response = await axios.post(createReviewApi, {
            productId,
            rating,
            comment
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 201 });
    } catch (error: unknown) {
        console.error("Create Review error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.user.accessToken;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { searchParams } = new URL(req.url);
        const reviewId = searchParams.get("reviewId") || '';
        const deleteReviewApi = process.env.USER_DELETE_REVIEW_BY_ID_API as string;
        const apiUrl = deleteReviewApi.replace("{reviewId}", reviewId);
        const response = await axios.delete(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error: unknown) {
        console.error("Delete Review error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
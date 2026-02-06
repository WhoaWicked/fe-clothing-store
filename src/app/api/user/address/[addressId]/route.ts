import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from 'next-auth';
import { authOptions } from "../../../auth/[...nextauth]/route";


export async function GET(req: NextRequest, { params }: { params: Promise<{ addressId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.user.accessToken;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { addressId } = await params;
        const getAddressByIdApi = process.env.USER_GET_ADDRESS_BY_ID_API as string;
        const apiUrl = getAddressByIdApi.replace("{addressId}", addressId);
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error) {
        console.error("Get Address By Id error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ addressId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.user.accessToken;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { addressId } = await params;
        const { street, sub_district, district, province, zip_code, phone, first_name, last_name } = await req.json();
        const updateAddressApi = process.env.USER_UPDATE_ADDRESS_API as string;
        const apiUrl = updateAddressApi.replace("{addressId}", addressId);
        const response = await axios.put(apiUrl, {
            street,
            sub_district,
            district,
            province,
            zip_code,
            phone,
            first_name,
            last_name
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error: unknown) {
        console.error("Update Address By Id error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ addressId: string }> }) {
    try {   
        const session = await getServerSession(authOptions);
        const token = session?.user.accessToken;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { addressId } = await params;
        const deleteAddressApi = process.env.USER_DELETE_ADDRESS_API as string;
        const apiUrl = deleteAddressApi.replace("{addressId}", addressId);
        const response = await axios.delete(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error: unknown) {
        console.error("Delete Address By Id error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
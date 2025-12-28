import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const getAddressListApi = process.env.USER_GET_ADDRESS_LIST_API as string;
        const response = await axios.get(getAddressListApi, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error) {
        console.error("Get Address List error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
        }
        const { street, sub_district, district, province, zip_code, phone, first_name, last_name } = await req.json();
        const createAddressApi = process.env.USER_CREATE_ADDRESS_API as string;
        const response = await axios.post(createAddressApi, {
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
    } catch (error) {
        console.error("Create Address error:", error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
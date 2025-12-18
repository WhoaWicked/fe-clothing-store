import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
        response.cookies.set('token', '', {
            httpOnly: true,
            path: '/',
            maxAge: 0,
            // sameSite: 'lax',
        });
        return response;
    } catch (error: unknown) {
        console.error("Logout error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
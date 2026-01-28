import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function POST(request: NextRequest) {
  try {
    const adminToken = request.cookies.get("admin_token")?.value;

    if (!adminToken) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const response = await fetch(`${API_URL}/api/dimensions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `admin_token=${adminToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Dimensions API error:", error);
    return NextResponse.json(
      { message: "Failed to create dimension", error: error.message },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminToken = request.cookies.get("admin_token")?.value;
    const isAdmin = request.nextUrl.searchParams.get("admin") === "true";

    const url = isAdmin
      ? `${API_URL}/api/dimensions/admin/all`
      : `${API_URL}/api/dimensions`;

    const headers: any = {
      "Content-Type": "application/json",
    };

    if (adminToken) {
      headers.Cookie = `admin_token=${adminToken}`;
    }

    const response = await fetch(url, { headers });
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Dimensions API error:", error);
    return NextResponse.json(
      { message: "Failed to fetch dimensions", error: error.message },
      { status: 500 },
    );
  }
}

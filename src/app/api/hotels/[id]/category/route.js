import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req) {
  const params = req.nextUrl.searchParams;
  const hotelId = params.get('id');
  try {
    const body = await req.json();
    const { name, imageUrl, menuIds } = body;

    if (!name) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    if (!hotelId) {
      return new NextResponse("Hotel ID is required", { status: 400 });
    }

    const category = await prismadb.category.create({
      data: {
        name,
        imageUrl,
        hotelId,
        menuIds: menuIds || [], // Ensure menuIds is an array
      },
    });

 return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
export async function GET(req, { params }) {
  const hotelId = params.id;
  try {
    const categories = await prismadb.category.findMany({ where: { hotelId } });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

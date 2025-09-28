import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: "Hotel ID is required" }, { status: 400 });
    }

    const hotel = await prisma.hotel.findUnique({
      where: {
        hotel_id: id,
      },
      include: {
        categories: true,
        items: true,
        orders: true,
        reviews: true,
        Subscription: true,
        password:false,
      },
    });

    if (!hotel) {
      return NextResponse.json({ message: "Hotel not found" }, { status: 404 });
    }

    return NextResponse.json({ hotel });
  } catch (error) {
    console.error("Error fetching hotel:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

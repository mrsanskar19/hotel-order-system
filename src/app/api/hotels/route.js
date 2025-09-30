// app/api/hotels/route.ts or app/api/hotels/index.ts (depending on your setup)
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      email,
      phone,
      address,
      images,
      active_time,
      parcel_available,
      username,
      password,
      upi_id,
    } = body;

    // Required fields check
    if (!name || !username || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if username already exists
    const existingHotel = await prisma.hotel.findUnique({
      where: { username },
    });

    if (existingHotel) {
      return NextResponse.json({ message: "Username already exists" }, { status: 409 });
    }

    const newHotel = await prisma.hotel.create({
      data: {
        name,
        description,
        email,
        phone,
        address,
        images,
        active_time,
        parcel_available,
        is_active: true,
        is_verify: true,
        username,
        password,
        upi_id,
      },
    });

    return NextResponse.json(newHotel);
  } catch (error) {
    console.error("Error adding hotel:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const hotels = await prisma.hotel.findMany({
      include: {
        categories: true,
        items: true,
        orders: true,
        reviews: true,
        Subscription: true,
      },
    });

    return NextResponse.json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Missing hotel ID" }, { status: 400 });
    }

    await prisma.hotel.delete({
      where: {
        hotel_id: id,
      },
    });

    return NextResponse.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      hotel_id,
      name,
      description,
      email,
      phone,
      address,
      images,
      active_time,
      parcel_available,
      is_active,
      is_verify,
      username,
      password,
      upi_id,
    } = body;

    if (!hotel_id) {
      return NextResponse.json({ message: "Missing hotel ID" }, { status: 400 });
    }

    const updatedHotel = await prisma.hotel.update({
      where: {
        hotel_id,
      },
      data: {
        name,
        description,
        email,
        phone,
        address,
        images,
        active_time,
        parcel_available,
        is_active,
        is_verify,
        username,
        password,
        upi_id,
      },
    });

    return NextResponse.json(updatedHotel);
  } catch (error) {
    console.error("Error updating hotel:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

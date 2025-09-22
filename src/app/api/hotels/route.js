import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, price, location, images, reviews, rating } = body;

    const newHotel = await prisma.hotel.create({
      data: {
        name,
        description,
        price,
        location,
        images,
        reviews,
        rating,
      },
    });

    return NextResponse.json(newHotel);
  } catch (error) {
    console.error("Error adding hotel:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const hotels = await prisma.hotel.findMany();
    return NextResponse.json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Missing hotel ID", { status: 400 });
    }

    await prisma.hotel.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, description, price, location, images, reviews, rating } = body;

    if (!id) {
      return new NextResponse("Missing hotel ID", { status: 400 });
    }

    const updatedHotel = await prisma.hotel.update({
      where: {
        id: id,
      },
      data: {
        name,
        description,
        price,
        location,
        images,
        reviews,
        rating,
      },
    });

    return NextResponse.json(updatedHotel);
  } catch (error) {
    console.error("Error updating hotel:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

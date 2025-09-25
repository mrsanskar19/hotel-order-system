import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

const sampleHotels = [
  {
    id: "1",
    name: "The Plaza Hotel",
    description:
      "A luxury hotel located in the heart of New York City, offering stunning views of Central Park.",
    price: 750,
    location: "New York, NY",
    images: [
      "https://example.com/plaza1.jpg",
      "https://example.com/plaza2.jpg",
    ],
    reviews: 1200,
    rating: 4.8,
  },
  {
    id: "2",
    name: "The Beverly Hills Hotel",
    description:
      "A historic hotel known for its iconic pink exterior and bungalows favored by celebrities.",
    price: 900,
    location: "Beverly Hills, CA",
    images: [
      "https://example.com/beverly1.jpg",
      "https://example.com/beverly2.jpg",
    ],
    reviews: 950,
    rating: 4.7,
  },
  {
    id: "3",
    name: "The Langham, Chicago",
    description:
      "A modern hotel with elegant design and sweeping views of the Chicago River and skyline.",
    price: 600,
    location: "Chicago, IL",
    images: [
      "https://example.com/langham1.jpg",
      "https://example.com/langham2.jpg",
    ],
    reviews: 800,
    rating: 4.9,
  },
];


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
    if (hotels.length === 0) {
      return NextResponse.json(sampleHotels);
    }
    return NextResponse.json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return NextResponse.json(sampleHotels);
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
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb"

export async function GET(request, context) {
  const { params } = context;
  const { id } = params;
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');

  let items;

  if (categoryId) {
    items = await prisma.item.findMany({
      where: {
        hotel_id: id,
        category_id: categoryId,
      },
    });
  } else {
    items = await prisma.item.findMany({
      where: {
        hotel_id: id,
      },
    });
  }

  return NextResponse.json(items);
}

export async function POST(request, { params }) {
  const { id } = params;
  const body = await request.json();

  const newItem = await prisma.item.create({
    data: {
      ...body,
      hotelId: id,
    },
  });

  return NextResponse.json(newItem);
}



export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();
  
  return NextResponse.json({ message: `Updating item for hotel ${id}`, item: body });
}

export async function DELETE(request, { params }) {
  const { id } = params;
    const body = await request.json();

  const deletedItem = await prisma.item.delete({
    where: {
      id: body.id,
      hotelId: id, // Ensure the item belongs to the hotel
    },
  });

  return NextResponse.json(deletedItem);

}

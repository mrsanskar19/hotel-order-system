// Suggested code may be subject to a license. Learn more: ~LicenseLog:2934584808.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:619323109.
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req,
  { params }
) {
  try {
    if (!params.itemId) {
      return new NextResponse("Item id is required", { status: 400 });
    }

    const item = await prismadb.item.findUnique({
      where: {
        id: params.itemId
      }
    });
  
    return NextResponse.json(item);
  } catch (error) {
    console.log('[ITEM_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req,
  { params }
) {
  try {

    if (!params.itemId) {
      return new NextResponse("Item id is required", { status: 400 });
    }

    const item = await prismadb.item.delete({
      where: {
        id: params.itemId
      }
    });
  
    return NextResponse.json(item);
  } catch (error) {
    console.log('[ITEM_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function PATCH(
  req,
  { params }
) {
  try {
    const body = await req.json();
    
    const { name, price, categoryId, sizeId, colorId, images, isFeatured, isArchived } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    if (!params.itemId) {
      return new NextResponse("Item id is required", { status: 400 });
    }

    await prismadb.item.update({
      where: {
        id: params.itemId
      },
      data: {
        name,
        price,
        categoryId,
        sizeId,
        colorId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      }
    });

    const item = await prismadb.item.update({
      where: {
        id: params.itemId
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image) => ({ url: image.url })),
            ],
          },
        },
      },
    });
  
    return NextResponse.json(item);
  } catch (error) {
    console.log('[ITEM_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

import { NextResponse } from "next/server"
import prisma from "@/lib/prismadb"

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    if (!id) {
      return new NextResponse("Missing notification ID", { status: 400 })
    }

    await prisma.notification.delete({
      where: {
        id: Number.parseInt(id),
      },
    })

    return NextResponse.json({ message: "Notification deleted successfully" })
  } catch (error) {
    console.error("Error deleting notification:", error)
    return new NextResponse(error.message || "Internal Server Error", { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, message, type, target } = body

    if (!id) {
      return new NextResponse("Missing notification ID", { status: 400 })
    }

    const notification = await prisma.notification.update({
      where: {
        id: Number.parseInt(id),
      },
      data: {
        title,
        message,
        type,
        target,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error("Error updating notification:", error)
    return new NextResponse(error.message || "Internal Server Error", { status: 500 })
  }
}

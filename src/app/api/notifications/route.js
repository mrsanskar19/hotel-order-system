import { NextResponse } from "next/server"
import prisma from "@/lib/prismadb"

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return new NextResponse(error.message || "Internal Server Error", { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { title, message, type, target } = body

    if (!title || !message) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type: type || "info",
        target: target || "all",
        createdAt: new Date(),
      },
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error("Error creating notification:", error)
    return new NextResponse(error.message || "Internal Server Error", { status: 500 })
  }
}

import { NextResponse } from "next/server"
import prisma from "@/lib/prismadb"

export async function GET() {
  try {
    // Get analytics data
    const totalOrders = await prisma.order.count()
    const totalRevenue = await prisma.order.aggregate({
      _sum: {
        total_amount: true,
      },
    })

    const activeUsers = await prisma.user.count({
      where: {
        lastActive: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    })

    // Calculate conversion rate (orders vs visits)
    const totalVisits = await prisma.analytics.aggregate({
      _sum: {
        visits: true,
      },
    })

    const conversionRate = totalVisits._sum.visits > 0 ? ((totalOrders / totalVisits._sum.visits) * 100).toFixed(2) : 0

    // Get hourly order data for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const ordersByHour = await prisma.order.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: today,
        },
      },
      _count: {
        order_id: true,
      },
    })

    // Process hourly data
    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      orders: 0,
    }))

    ordersByHour.forEach((order) => {
      const hour = new Date(order.createdAt).getHours()
      hourlyData[hour].orders += order._count.order_id
    })

    const analytics = {
      summary: {
        totalOrders,
        totalRevenue: totalRevenue._sum.total_amount || 0,
        activeUsers,
        conversionRate: Number.parseFloat(conversionRate),
      },
      hourlyData,
      realtime: {
        time: new Date().toLocaleTimeString(),
        orders: Math.floor(Math.random() * 10), // Simulated real-time data
      },
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return new NextResponse(error.message || "Internal Server Error", { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { event, data } = body

    // Track analytics events
    await prisma.analytics.create({
      data: {
        event,
        data: JSON.stringify(data),
        timestamp: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking analytics:", error)
    return new NextResponse(error.message || "Internal Server Error", { status: 500 })
  }
}

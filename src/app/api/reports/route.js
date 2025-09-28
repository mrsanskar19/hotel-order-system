import { NextResponse } from "next/server"
import prisma from "@/lib/prismadb"

export async function POST(request) {
  try {
    const body = await request.json()
    const { type, dateRange } = body

    const startDate = new Date(dateRange.from)
    const endDate = new Date(dateRange.to)

    let reportData = {}

    switch (type) {
      case "sales":
        reportData = await generateSalesReport(startDate, endDate)
        break
      case "orders":
        reportData = await generateOrdersReport(startDate, endDate)
        break
      case "customers":
        reportData = await generateCustomersReport(startDate, endDate)
        break
      case "inventory":
        reportData = await generateInventoryReport(startDate, endDate)
        break
      case "performance":
        reportData = await generatePerformanceReport(startDate, endDate)
        break
      default:
        return new NextResponse("Invalid report type", { status: 400 })
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error("Error generating report:", error)
    return new NextResponse(error.message || "Internal Server Error", { status: 500 })
  }
}

async function generateSalesReport(startDate, endDate) {
  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      items: true,
      hotel: true,
    },
  })

  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0)
  const totalOrders = orders.length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Generate daily revenue data
  const revenueByDay = {}
  orders.forEach((order) => {
    const date = order.createdAt.toISOString().split("T")[0]
    revenueByDay[date] = (revenueByDay[date] || 0) + order.total_amount
  })

  const chartData = {
    revenue: Object.entries(revenueByDay).map(([date, amount]) => ({
      date,
      amount,
    })),
  }

  return {
    summary: {
      totalRevenue,
      totalOrders,
      avgOrderValue: Math.round(avgOrderValue),
      revenueChange: 12, // Calculate actual change
      ordersChange: 8,
      aovChange: 5,
    },
    chartData,
  }
}

async function generateOrdersReport(startDate, endDate) {
  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      items: {
        include: {
          item: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  })

  // Group by category
  const categoryData = {}
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const category = item.item.category.name
      categoryData[category] = (categoryData[category] || 0) + item.quantity
    })
  })

  const chartData = {
    categories: Object.entries(categoryData).map(([category, orders]) => ({
      category,
      orders,
    })),
  }

  return {
    summary: {
      totalOrders: orders.length,
      ordersChange: 15,
    },
    chartData,
  }
}

async function generateCustomersReport(startDate, endDate) {
  // Implementation for customer report
  return {
    summary: {
      totalCustomers: 0,
      newCustomers: 0,
      returningCustomers: 0,
    },
    chartData: {},
  }
}

async function generateInventoryReport(startDate, endDate) {
  // Implementation for inventory report
  return {
    summary: {
      totalItems: 0,
      lowStockItems: 0,
      outOfStockItems: 0,
    },
    chartData: {},
  }
}

async function generatePerformanceReport(startDate, endDate) {
  // Implementation for performance report
  return {
    summary: {
      avgResponseTime: 0,
      successRate: 0,
      errorRate: 0,
    },
    chartData: {},
  }
}

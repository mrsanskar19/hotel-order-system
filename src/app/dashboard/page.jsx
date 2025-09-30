"use client"

import { useState, useEffect } from "react"
import { socket } from "@/lib/socket"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Users, ShoppingCart, Clock, DollarSign, Activity } from "lucide-react"

const DashboardPage = () => {
  const [salesData, setSalesData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    newCustomers: 0,
    avgOrderValue: 0,
  })

  const [recentOrders, setRecentOrders] = useState([])
  const [topSellingItems, setTopSellingItems] = useState([])
  const [tableStatus, setTableStatus] = useState([])
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [mounted, setMounted] = useState(false)
  const [timeRange, setTimeRange] = useState("Last 12 hours")

  const allTables = [1, 2, 3, 4, 5, 6, 7, 8]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const onConnect = () => setIsConnected(true)
    const onDisconnect = () => setIsConnected(false)

    const onNewOrder = (newOrder) => {
      const orderAmount = newOrder.items.reduce((acc, item) => acc + (item.price || 10) * item.quantity, 0)
      const orderForDisplay = {
        ...newOrder,
        customer: `Table ${newOrder.tableId}`,
        amount: orderAmount,
        timestamp: new Date().toISOString(),
      }

      setRecentOrders((prev) => [orderForDisplay, ...prev].slice(0, 8))
      setSalesData((prev) => ({
        ...prev,
        totalOrders: prev.totalOrders + 1,
        totalRevenue: prev.totalRevenue + orderAmount,
        avgOrderValue: (prev.totalRevenue + orderAmount) / (prev.totalOrders + 1),
      }))

      newOrder.items.forEach((item) => {
        setTopSellingItems((prevItems) => {
          const itemIndex = prevItems.findIndex((i) => i.name === item.name)
          if (itemIndex > -1) {
            const newItems = [...prevItems]
            newItems[itemIndex].sales += item.quantity
            return newItems.sort((a, b) => b.sales - a.sales).slice(0, 6)
          } else {
            return [...prevItems, { name: item.name, sales: item.quantity }]
              .sort((a, b) => b.sales - a.sales)
              .slice(0, 6)
          }
        })
      })
    }

    const onOrderUpdated = (updatedOrder) => {
      const orderAmount = updatedOrder.items.reduce((acc, item) => acc + (item.price || 10) * item.quantity, 0)
      setRecentOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? { ...o, ...updatedOrder, amount: orderAmount } : o)),
      )
    }

    const onTableUpdated = (tables) => {
      const occupiedIds = tables.map((t) => t.id)
      setTableStatus(
        allTables.map((id) => ({
          id,
          status: occupiedIds.includes(String(id)) ? "Occupied" : "Available",
          orders: occupiedIds.includes(String(id)) ? Math.floor(Math.random() * 3) + 1 : 0,
        })),
      )
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    socket.on("new_order", onNewOrder)
    socket.on("order_updated", onOrderUpdated)
    socket.on("table_updated", onTableUpdated)

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
      socket.off("new_order", onNewOrder)
      socket.off("order_updated", onOrderUpdated)
      socket.off("table_updated", onTableUpdated)
    }
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Preparing":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Pending":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTableStatusColor = (status) => {
    switch (status) {
      case "Occupied":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "Available":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Reserved":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Dashboard</h1>
          {mounted && (
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className="text-sm text-gray-700">{isConnected ? "Connected" : "Disconnected"}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option>Last 12 hours</option>
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white shadow-lg border border-gray-200 rounded-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">${salesData.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              +12.5% from last period
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border border-gray-200 rounded-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600">Total Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{salesData.totalOrders}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              +8.2% from last period
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border border-gray-200 rounded-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600">Avg Order Value</CardTitle>
            <BarChart3 className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">${salesData.avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              +3.1% from last period
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border border-gray-200 rounded-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600">Active Tables</CardTitle>
            <Users className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {tableStatus.filter((t) => t.status === "Occupied").length}/{allTables.length}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {Math.round((tableStatus.filter((t) => t.status === "Occupied").length / allTables.length) * 100)}%
              occupancy
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white shadow-lg border border-gray-200 rounded-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2 text-lg font-semibold">
              <Clock className="h-6 w-6" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-indigo-900">#{order.id}</span>
                        <Badge variant="outline" className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-indigo-700">{order.customer}</p>
                      <p className="text-xs text-indigo-500">{new Date(order.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-indigo-900">${order.amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-indigo-500 py-8">No recent orders</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border border-gray-200 rounded-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2 text-lg font-semibold">
              <BarChart3 className="h-6 w-6" />
              Top Selling Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {topSellingItems.length > 0 ? (
                topSellingItems.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-indigo-200 text-indigo-900 rounded-full text-lg font-bold">
                        {index + 1}
                      </div>
                      <span className="font-semibold text-indigo-900">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-indigo-900">{item.sales}</p>
                      <p className="text-xs text-indigo-600">sold</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-indigo-500 py-8">No sales data</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-lg border border-gray-200 rounded-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2 text-lg font-semibold">
            <Users className="h-6 w-6" />
            Table Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
            {tableStatus.map((table) => (
              <div
                key={table.id}
                className={`p-6 rounded-lg border text-center transition-transform hover:scale-105 shadow-md hover:shadow-lg duration-300 ${getTableStatusColor(table.status)}`}
              >
                <div className="font-bold text-xl mb-2">T{table.id}</div>
                <div className="text-sm mb-3">{table.status}</div>
                {table.orders > 0 && <div className="text-sm opacity-75">{table.orders} orders</div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage

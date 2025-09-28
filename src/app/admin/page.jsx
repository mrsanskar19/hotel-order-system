"use client"

import { useState, useEffect } from "react"
import { socket } from "@/lib/socket"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Search, Filter, Clock, CheckCircle, AlertCircle, ChefHat, Truck, Eye, RefreshCw } from "lucide-react"

const generateOrderId = () => {
  return "ORD-" + Math.random().toString(36).substring(2, 9).toUpperCase()
}

export default function AdminPage() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [notifications, setNotifications] = useState([])
  const [stats, setStats] = useState({
    pending: 0,
    preparing: 0,
    ready: 0,
    delivered: 0,
  })

  useEffect(() => {
    const connectSocket = async () => {
      socket.on("connect", () => {
        setIsConnected(true)
        console.log("Admin connected to Socket.IO server.")
      })

      socket.on("disconnect", () => {
        setIsConnected(false)
        console.log("Admin disconnected from Socket.IO server.")
      })

      socket.on("new_order", (newOrder) => {
        console.log("New order received from server:", newOrder)
        const orderWithTimestamp = {
          ...newOrder,
          timestamp: new Date().toISOString(),
          estimatedTime: Math.floor(Math.random() * 30) + 10, // 10-40 minutes
        }
        setOrders((prevOrders) => [orderWithTimestamp, ...prevOrders])

        // Add notification
        setNotifications((prev) =>
          [
            {
              id: Date.now(),
              message: `New order #${newOrder.id} from Table ${newOrder.tableId}`,
              type: "new_order",
              timestamp: new Date().toISOString(),
            },
            ...prev,
          ].slice(0, 10),
        )
      })

      socket.on("order_updated", (updatedOrder) => {
        console.log("Order updated from server:", updatedOrder)
        setOrders((prevOrders) =>
          prevOrders.map((order) => (order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order)),
        )
      })

      return () => {
        if (socket) {
          socket.disconnect()
          console.log("Socket disconnected on component unmount.")
        }
      }
    }

    if (!socket) {
      connectSocket()
    }
  }, [])

  // Update filtered orders and stats when orders or filters change
  useEffect(() => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.tableId?.toString().includes(searchTerm),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status.toLowerCase() === statusFilter.toLowerCase())
    }

    setFilteredOrders(filtered)

    // Update stats
    const newStats = {
      pending: orders.filter((o) => o.status === "Pending").length,
      preparing: orders.filter((o) => o.status === "Preparing").length,
      ready: orders.filter((o) => o.status === "Ready").length,
      delivered: orders.filter((o) => o.status === "Delivered").length,
    }
    setStats(newStats)
  }, [orders, searchTerm, statusFilter])

  const updateOrderStatus = (orderId, status) => {
    if (socket && isConnected) {
      socket.emit("update_order_status", { orderId, status })

      // Add notification for status change
      setNotifications((prev) =>
        [
          {
            id: Date.now(),
            message: `Order #${orderId} status updated to ${status}`,
            type: "status_update",
            timestamp: new Date().toISOString(),
          },
          ...prev,
        ].slice(0, 10),
      )
    } else {
      console.error("Socket not connected. Cannot update order status.")
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />
      case "Preparing":
        return <ChefHat className="h-4 w-4" />
      case "Ready":
        return <CheckCircle className="h-4 w-4" />
      case "Delivered":
        return <Truck className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Preparing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Ready":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Delivered":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Management</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`}></div>
              <span className="text-sm text-muted-foreground">{isConnected ? "Connected" : "Disconnected"}</span>
            </div>
            {notifications.length > 0 && (
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-yellow-400">{notifications.length} new notifications</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {notifications.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearNotifications}>
              Clear Notifications
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Preparing</p>
                <p className="text-2xl font-bold text-blue-400">{stats.preparing}</p>
              </div>
              <ChefHat className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ready</p>
                <p className="text-2xl font-bold text-green-400">{stats.ready}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold text-purple-400">{stats.delivered}</p>
              </div>
              <Truck className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="notifications">Notifications ({notifications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          {/* Filters */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search orders by ID, item, or table..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background border-border"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="preparing">Preparing</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Orders ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-accent/50 rounded-lg border border-border hover:bg-accent/70 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-lg text-foreground">#{order.id}</span>
                          <Badge variant="outline" className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status}</span>
                          </Badge>
                          {order.tableId && (
                            <Badge variant="outline" className="bg-muted text-muted-foreground">
                              Table {order.tableId}
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Item:</span> {order.item || "Multiple items"}
                          </div>
                          <div>
                            <span className="font-medium">Quantity:</span> {order.quantity || "N/A"}
                          </div>
                          <div>
                            <span className="font-medium">Time:</span> {new Date(order.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                        {order.estimatedTime && order.status === "Preparing" && (
                          <div className="mt-2 text-xs text-blue-400">
                            Estimated completion: {order.estimatedTime} minutes
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                          <SelectTrigger className="w-32 bg-background border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Preparing">Preparing</SelectItem>
                            <SelectItem value="Ready">Ready</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">No orders found</p>
                    <p className="text-muted-foreground text-sm">
                      {searchTerm || statusFilter !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "Orders will appear here when customers place them"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg border border-border"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {notification.type === "new_order" ? (
                          <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                        ) : (
                          <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground text-sm">{notification.message}</p>
                        <p className="text-muted-foreground text-xs mt-1">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No notifications</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

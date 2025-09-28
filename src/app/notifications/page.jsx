"use client"
import { useState, useEffect } from "react"
import { useSocketContext } from "@/providers/SocketProvider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Send, Trash2, Filter, Search } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function NotificationsPage() {
  const { socket, isConnected, notifications, removeNotification, clearNotifications } = useSocketContext()
  const [allNotifications, setAllNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info",
    target: "all",
  })

  useEffect(() => {
    // Fetch existing notifications
    fetchNotifications()
  }, [])

  useEffect(() => {
    // Filter notifications based on search and type
    let filtered = allNotifications

    if (searchTerm) {
      filtered = filtered.filter(
        (n) =>
          n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.message?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterType !== "all") {
      filtered = filtered.filter((n) => n.type === filterType)
    }

    setFilteredNotifications(filtered)
  }, [allNotifications, searchTerm, filterType])

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications")
      const data = await response.json()
      setAllNotifications(data)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  const sendNotification = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNotification),
      })

      if (response.ok) {
        const notification = await response.json()
        setAllNotifications((prev) => [notification, ...prev])

        // Send via socket for real-time delivery
        if (socket && isConnected) {
          socket.emit("send-notification", notification)
        }

        // Reset form
        setNewNotification({
          title: "",
          message: "",
          type: "info",
          target: "all",
        })
      }
    } catch (error) {
      console.error("Error sending notification:", error)
    }
  }

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setAllNotifications((prev) => prev.filter((n) => n.id !== id))
        removeNotification(id)
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Manage and send notifications</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "default" : "destructive"}>
            <Bell className="w-3 h-3 mr-1" />
            {isConnected ? "Connected" : "Offline"}
          </Badge>
          <Button variant="outline" size="sm" onClick={clearNotifications}>
            Clear All
          </Button>
        </div>
      </div>

      {/* Send New Notification */}
      <Card>
        <CardHeader>
          <CardTitle>Send Notification</CardTitle>
          <CardDescription>Create and send notifications to users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Notification title"
              value={newNotification.title}
              onChange={(e) => setNewNotification((prev) => ({ ...prev, title: e.target.value }))}
            />
            <Select
              value={newNotification.type}
              onValueChange={(value) => setNewNotification((prev) => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="Notification message"
            value={newNotification.message}
            onChange={(e) => setNewNotification((prev) => ({ ...prev, message: e.target.value }))}
            rows={3}
          />

          <div className="flex flex-col md:flex-row gap-4">
            <Select
              value={newNotification.target}
              onValueChange={(value) => setNewNotification((prev) => ({ ...prev, target: value }))}
            >
              <SelectTrigger className="md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="admin">Admins Only</SelectItem>
                <SelectItem value="hotel">Hotels Only</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={sendNotification} disabled={!newNotification.title || !newNotification.message}>
              <Send className="w-4 h-4 mr-2" />
              Send Notification
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="md:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications found</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card key={notification.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <Badge className={getTypeColor(notification.type)}>{notification.type}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

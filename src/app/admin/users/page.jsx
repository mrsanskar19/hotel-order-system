"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Search,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
} from "lucide-react"

const UsersPage = () => {
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      role: "admin",
      status: "active",
      lastLogin: "2024-01-15T10:30:00Z",
      joinDate: "2023-06-15T00:00:00Z",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1234567891",
      role: "manager",
      status: "active",
      lastLogin: "2024-01-14T15:45:00Z",
      joinDate: "2023-08-20T00:00:00Z",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+1234567892",
      role: "staff",
      status: "inactive",
      lastLogin: "2024-01-10T09:15:00Z",
      joinDate: "2023-12-01T00:00:00Z",
      avatar: "/placeholder-user.jpg",
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState(users)
  const [selectedTab, setSelectedTab] = useState("all")

  useEffect(() => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm),
      )
    }

    if (selectedTab !== "all") {
      filtered = filtered.filter((user) => user.role === selectedTab)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, selectedTab])

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "manager":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "staff":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "inactive":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <ShieldCheck className="h-4 w-4" />
      case "manager":
        return <Shield className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const stats = {
    total: users.length,
    admin: users.filter((u) => u.role === "admin").length,
    manager: users.filter((u) => u.role === "manager").length,
    staff: users.filter((u) => u.role === "staff").length,
    active: users.filter((u) => u.status === "active").length,
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage hotel staff and administrators</p>
        </div>
        <Button className="mt-4 sm:mt-0">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold text-red-400">{stats.admin}</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Managers</p>
                <p className="text-2xl font-bold text-blue-400">{stats.manager}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Staff</p>
                <p className="text-2xl font-bold text-green-400">{stats.staff}</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-400">{stats.active}</p>
              </div>
              <div className="h-8 w-8 bg-green-400 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-background rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="admin">Admins</TabsTrigger>
            <TabsTrigger value="manager">Managers</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
          </TabsList>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>
        </div>

        <TabsContent value={selectedTab} className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Users ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-accent/50 rounded-lg border border-border hover:bg-accent/70 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                       

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{user.name}</h3>
                            <Badge variant="outline" className={getRoleColor(user.role)}>
                              {getRoleIcon(user.role)}
                              <span className="ml-1 capitalize">{user.role}</span>
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(user.status)}>
                              <span className="capitalize">{user.status}</span>
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {user.phone}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Joined {new Date(user.joinDate).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground mt-1">
                            Last login: {new Date(user.lastLogin).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">No users found</p>
                    <p className="text-muted-foreground text-sm">
                      {searchTerm ? "Try adjusting your search criteria" : "Add users to get started"}
                    </p>
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

export default UsersPage

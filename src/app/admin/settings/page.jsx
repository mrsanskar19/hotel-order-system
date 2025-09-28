"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Hotel, Bell, Shield, Save, Upload } from "lucide-react"

const SettingsPage = () => {
  const [hotelSettings, setHotelSettings] = useState({
    name: "Grand Hotel Restaurant",
    description: "Fine dining experience with exceptional service",
    address: "123 Main Street, City, State 12345",
    phone: "+1 (555) 123-4567",
    email: "info@grandhotel.com",
    website: "https://grandhotel.com",
    logo: "/placeholder-logo.png",
    timezone: "America/New_York",
    currency: "USD",
    taxRate: "8.5",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    newOrders: true,
    orderUpdates: true,
    lowStock: true,
    dailyReports: false,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  })

  const [operationalSettings, setOperationalSettings] = useState({
    autoAcceptOrders: false,
    orderTimeout: "30",
    maxTablesPerOrder: "1",
    allowPreOrders: true,
    requireCustomerInfo: false,
    enableTableReservations: true,
    defaultOrderStatus: "Pending",
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "60",
    passwordExpiry: "90",
    loginAttempts: "5",
    ipWhitelist: "",
    auditLogs: true,
  })

  const handleHotelSettingChange = (field, value) => {
    setHotelSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field, value) => {
    setNotificationSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleOperationalChange = (field, value) => {
    setOperationalSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSecurityChange = (field, value) => {
    setSecuritySettings((prev) => ({ ...prev, [field]: value }))
  }

  const saveSettings = (section) => {
    console.log(`Saving ${section} settings...`)
    // Here you would typically make an API call to save the settings
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Configure your hotel management system</p>
        </div>
      </div>

      <Tabs defaultValue="hotel" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="hotel" className="flex items-center gap-2">
            <Hotel className="h-4 w-4" />
            Hotel Info
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="operations" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Operations
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hotel" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Hotel className="h-5 w-5" />
                Hotel Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="hotelName">Hotel Name</Label>
                  <Input
                    id="hotelName"
                    value={hotelSettings.name}
                    onChange={(e) => handleHotelSettingChange("name", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={hotelSettings.phone}
                    onChange={(e) => handleHotelSettingChange("phone", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={hotelSettings.email}
                    onChange={(e) => handleHotelSettingChange("email", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={hotelSettings.website}
                    onChange={(e) => handleHotelSettingChange("website", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={hotelSettings.timezone}
                    onChange={(e) => handleHotelSettingChange("timezone", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={hotelSettings.currency}
                    onChange={(e) => handleHotelSettingChange("currency", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={hotelSettings.address}
                  onChange={(e) => handleHotelSettingChange("address", e.target.value)}
                  className="bg-background border-border"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={hotelSettings.description}
                  onChange={(e) => handleHotelSettingChange("description", e.target.value)}
                  className="bg-background border-border"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Hotel Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center">
                    <Hotel className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                </div>
              </div>

              <Button onClick={() => saveSettings("hotel")} className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Save Hotel Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newOrders">New Orders</Label>
                    <p className="text-sm text-muted-foreground">Get notified when new orders are placed</p>
                  </div>
                  <Switch
                    id="newOrders"
                    checked={notificationSettings.newOrders}
                    onCheckedChange={(checked) => handleNotificationChange("newOrders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="orderUpdates">Order Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified when order status changes</p>
                  </div>
                  <Switch
                    id="orderUpdates"
                    checked={notificationSettings.orderUpdates}
                    onCheckedChange={(checked) => handleNotificationChange("orderUpdates", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="lowStock">Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when items are running low</p>
                  </div>
                  <Switch
                    id="lowStock"
                    checked={notificationSettings.lowStock}
                    onCheckedChange={(checked) => handleNotificationChange("lowStock", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dailyReports">Daily Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive daily sales and performance reports</p>
                  </div>
                  <Switch
                    id="dailyReports"
                    checked={notificationSettings.dailyReports}
                    onCheckedChange={(checked) => handleNotificationChange("dailyReports", checked)}
                  />
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Notification Channels</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsNotifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushNotifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={() => saveSettings("notifications")} className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Operational Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="orderTimeout">Order Timeout (minutes)</Label>
                  <Input
                    id="orderTimeout"
                    type="number"
                    value={operationalSettings.orderTimeout}
                    onChange={(e) => handleOperationalChange("orderTimeout", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTables">Max Tables per Order</Label>
                  <Input
                    id="maxTables"
                    type="number"
                    value={operationalSettings.maxTablesPerOrder}
                    onChange={(e) => handleOperationalChange("maxTablesPerOrder", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoAccept">Auto Accept Orders</Label>
                    <p className="text-sm text-muted-foreground">Automatically accept new orders</p>
                  </div>
                  <Switch
                    id="autoAccept"
                    checked={operationalSettings.autoAcceptOrders}
                    onCheckedChange={(checked) => handleOperationalChange("autoAcceptOrders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowPreOrders">Allow Pre-orders</Label>
                    <p className="text-sm text-muted-foreground">Allow customers to place orders in advance</p>
                  </div>
                  <Switch
                    id="allowPreOrders"
                    checked={operationalSettings.allowPreOrders}
                    onCheckedChange={(checked) => handleOperationalChange("allowPreOrders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireCustomerInfo">Require Customer Info</Label>
                    <p className="text-sm text-muted-foreground">Require customer details for all orders</p>
                  </div>
                  <Switch
                    id="requireCustomerInfo"
                    checked={operationalSettings.requireCustomerInfo}
                    onCheckedChange={(checked) => handleOperationalChange("requireCustomerInfo", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableReservations">Enable Table Reservations</Label>
                    <p className="text-sm text-muted-foreground">Allow customers to reserve tables</p>
                  </div>
                  <Switch
                    id="enableReservations"
                    checked={operationalSettings.enableTableReservations}
                    onCheckedChange={(checked) => handleOperationalChange("enableTableReservations", checked)}
                  />
                </div>
              </div>

              <Button onClick={() => saveSettings("operations")} className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Save Operational Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => handleSecurityChange("sessionTimeout", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) => handleSecurityChange("passwordExpiry", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                  <Input
                    id="loginAttempts"
                    type="number"
                    value={securitySettings.loginAttempts}
                    onChange={(e) => handleSecurityChange("loginAttempts", e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                <Textarea
                  id="ipWhitelist"
                  placeholder="Enter IP addresses separated by commas"
                  value={securitySettings.ipWhitelist}
                  onChange={(e) => handleSecurityChange("ipWhitelist", e.target.value)}
                  className="bg-background border-border"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Enable 2FA for enhanced security</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSecurityChange("twoFactorAuth", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auditLogs">Audit Logs</Label>
                    <p className="text-sm text-muted-foreground">Keep detailed logs of all system activities</p>
                  </div>
                  <Switch
                    id="auditLogs"
                    checked={securitySettings.auditLogs}
                    onCheckedChange={(checked) => handleSecurityChange("auditLogs", checked)}
                  />
                </div>
              </div>

              <Button onClick={() => saveSettings("security")} className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SettingsPage

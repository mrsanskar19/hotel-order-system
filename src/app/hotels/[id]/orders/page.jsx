"use client"

import { useState, useEffect, useMemo } from "react"
import { socket } from "@/lib/socket"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, CreditCard, QrCode, Receipt, User, MapPin, Calendar, DollarSign } from "lucide-react"

const UPI_ID = "8351921719@axl"
const PAYEE_NAME = "Hotel Restaurant"

const SAMPLE_ORDER = {
  id: "sample-id",
  order_id: "ORD123456",
  status: "Active",
  total: 540,
  date: new Date().toISOString(),
  items: [
    { id: "1", name: "Margherita Pizza", quantity: 2, price: 150 },
    { id: "2", name: "Garlic Bread", quantity: 1, price: 90 },
    { id: "3", name: "Soft Drink", quantity: 2, price: 75 },
  ],
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [step, setStep] = useState("info")
  const [userInfo, setUserInfo] = useState({ name: "", phone: "" })
  const [tableId, setTableId] = useState("")
  const [loading, setLoading] = useState(false)

  const activeOrder = orders[0]

  useEffect(() => {
    const storedOrders = localStorage.getItem("active_orders")
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders))
    } else {
      setOrders([SAMPLE_ORDER])
      localStorage.setItem("active_orders", JSON.stringify([SAMPLE_ORDER]))
    }

    const storedTable = localStorage.getItem("tableId")
    if (storedTable) {
      setTableId(storedTable)
    } else {
      localStorage.setItem("tableId", "T5")
      setTableId("T5")
    }

    return () => {
      socket.disconnect()
    }
  }, [])

  const handleCloseOrder = async () => {
    setLoading(true)
    try {
      if (socket && activeOrder) {
        socket.emit("order:closed", {
          order_id: activeOrder.order_id,
          table_id: tableId,
        })
      }
      localStorage.removeItem("active_orders")
      setOrders([])
      setStep("done")
    } catch (error) {
      console.error("Error closing order:", error)
    } finally {
      setLoading(false)
    }
  }

  const upiUrl = useMemo(() => {
    if (!activeOrder) return ""
    return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${activeOrder.total}&cu=INR`
  }, [activeOrder])

  const qrCodeUrl = useMemo(() => {
    if (!upiUrl) return ""
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`
  }, [upiUrl])

  if (!activeOrder) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No Active Orders</h2>
          <p className="text-muted-foreground mb-6">Place an order to see it here.</p>
          <Button onClick={() => window.history.back()}>Back to Menu</Button>
        </div>
      </div>
    )
  }

  const renderInfo = () => (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name (Optional)</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={userInfo.name}
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            className="bg-background border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={userInfo.phone}
            onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
            className="bg-background border-border"
          />
        </div>
        <Button onClick={() => setStep("bill")} className="w-full">
          Continue to Bill
        </Button>
      </CardContent>
    </Card>
  )

  const renderBill = () => {
    const subtotal = activeOrder.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const tax = subtotal * 0.085
    const service = subtotal * 0.15
    const total = subtotal + tax + service

    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {activeOrder.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (8.5%)</span>
              <span className="text-foreground">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service Charge (15%)</span>
              <span className="text-foreground">${service.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">${total.toFixed(2)}</span>
            </div>
          </div>

          <Button onClick={() => setStep("payment")} className="w-full">
            <CreditCard className="h-4 w-4 mr-2" />
            Proceed to Payment
          </Button>
        </CardContent>
      </Card>
    )
  }

  const renderPayment = () => (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          UPI Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-lg mb-4">
            <DollarSign className="h-5 w-5" />
            <span className="text-xl font-bold">${activeOrder.total}</span>
          </div>
          <p className="text-muted-foreground mb-6">Scan the QR code below to complete payment</p>
        </div>

        {qrCodeUrl && (
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <img src={qrCodeUrl || "/placeholder.svg"} alt="UPI Payment QR Code" className="w-64 h-64 mx-auto" />
            </div>
          </div>
        )}

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">UPI ID: {UPI_ID}</p>
          <p className="text-sm text-muted-foreground">Payee: {PAYEE_NAME}</p>
        </div>

        <div className="space-y-3">
          <Button onClick={handleCloseOrder} disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </div>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Paid
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => setStep("bill")} className="w-full">
            Back to Bill
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderDone = () => (
    <Card className="bg-card border-border">
      <CardContent className="text-center py-12">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Payment Complete!</h3>
        <p className="text-muted-foreground mb-6">Thank you for your order. Your food will be prepared shortly.</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Order ID: {activeOrder.order_id}</p>
          <p>Table: {tableId}</p>
          <p>Estimated time: 20-30 minutes</p>
        </div>
        <Button onClick={() => window.history.back()} className="mt-6">
          Back to Menu
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Order Header */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Order #{activeOrder.order_id}</CardTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>Table {tableId}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(activeOrder.date).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                <Clock className="h-3 w-3 mr-1" />
                {activeOrder.status}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {["info", "bill", "payment", "done"].map((stepName, index) => {
              const isActive = step === stepName
              const isCompleted = ["info", "bill", "payment", "done"].indexOf(step) > index

              return (
                <div key={stepName} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  {index < 3 && <div className={`w-12 h-0.5 mx-2 ${isCompleted ? "bg-green-500" : "bg-muted"}`} />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {step === "info" && renderInfo()}
          {step === "bill" && renderBill()}
          {step === "payment" && renderPayment()}
          {step === "done" && renderDone()}
        </div>
      </div>
    </div>
  )
}

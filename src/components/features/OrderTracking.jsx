"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, ChefHat, Truck, MapPin } from "lucide-react"

export const OrderTracking = ({ orderId }) => {
  const [orderStatus, setOrderStatus] = useState({
    id: orderId,
    status: "preparing",
    estimatedTime: 25,
    currentStep: 2,
    steps: [
      { id: 1, name: "Order Confirmed", completed: true, time: "2 min ago" },
      { id: 2, name: "Preparing", completed: false, time: "In progress" },
      { id: 3, name: "Ready for Pickup", completed: false, time: "15 min" },
      { id: 4, name: "Delivered", completed: false, time: "25 min" },
    ],
  })

  useEffect(() => {
    // Simulate order progress
    const interval = setInterval(() => {
      setOrderStatus((prev) => {
        if (prev.currentStep < prev.steps.length) {
          const newSteps = prev.steps.map((step, index) => ({
            ...step,
            completed: index < prev.currentStep,
          }))

          return {
            ...prev,
            steps: newSteps,
            estimatedTime: Math.max(0, prev.estimatedTime - 1),
          }
        }
        return prev
      })
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const getStepIcon = (step, isActive, isCompleted) => {
    if (isCompleted) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }

    switch (step.id) {
      case 1:
        return <Clock className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
      case 2:
        return <ChefHat className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
      case 3:
        return <MapPin className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
      case 4:
        return <Truck className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
      default:
        return <Clock className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
    }
  }

  const progressPercentage = (orderStatus.currentStep / orderStatus.steps.length) * 100

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Order Tracking</CardTitle>
          <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            Order #{orderStatus.id}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Estimated Time */}
        <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Estimated Time</span>
          </div>
          <span className="text-lg font-bold text-primary">{orderStatus.estimatedTime} min</span>
        </div>

        {/* Order Steps */}
        <div className="space-y-4">
          {orderStatus.steps.map((step, index) => {
            const isActive = index === orderStatus.currentStep - 1
            const isCompleted = step.completed
            const isNext = index === orderStatus.currentStep

            return (
              <div key={step.id} className="flex items-center gap-4">
                <div className="flex-shrink-0">{getStepIcon(step, isActive || isNext, isCompleted)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-medium ${
                        isCompleted
                          ? "text-green-500"
                          : isActive || isNext
                            ? "text-foreground"
                            : "text-muted-foreground"
                      }`}
                    >
                      {step.name}
                    </span>
                    <span
                      className={`text-sm ${
                        isCompleted ? "text-green-500" : isActive || isNext ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {step.time}
                    </span>
                  </div>
                  {index < orderStatus.steps.length - 1 && (
                    <div className={`w-px h-6 ml-2.5 mt-2 ${isCompleted ? "bg-green-500" : "bg-border"}`} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

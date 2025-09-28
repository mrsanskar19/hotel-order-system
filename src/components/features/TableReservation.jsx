"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Users, MapPin, Phone, Mail } from "lucide-react"

export const TableReservation = ({ hotelId }) => {
  const [reservationData, setReservationData] = useState({
    date: "",
    time: "",
    guests: "",
    name: "",
    phone: "",
    email: "",
    specialRequests: "",
    tablePreference: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const timeSlots = [
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
    "9:30 PM",
  ]

  const tablePreferences = [
    "No preference",
    "Window seat",
    "Quiet corner",
    "Near the bar",
    "Private booth",
    "Outdoor seating",
  ]

  const handleInputChange = (field, value) => {
    setReservationData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Reservation submitted:", { ...reservationData, hotelId })
      setSubmitted(true)
    } catch (error) {
      console.error("Error submitting reservation:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Reservation Confirmed!</h3>
          <p className="text-muted-foreground mb-4">
            Your table has been reserved for {reservationData.date} at {reservationData.time}
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Confirmation will be sent to {reservationData.email}</p>
            <p>We'll call you at {reservationData.phone} if needed</p>
          </div>
          <Button
            onClick={() => {
              setSubmitted(false)
              setReservationData({
                date: "",
                time: "",
                guests: "",
                name: "",
                phone: "",
                email: "",
                specialRequests: "",
                tablePreference: "",
              })
            }}
            className="mt-6"
          >
            Make Another Reservation
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Table Reservation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={reservationData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time
              </Label>
              <Select value={reservationData.time} onValueChange={(value) => handleInputChange("time", value)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Guests and Table Preference */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guests" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Number of Guests
              </Label>
              <Select value={reservationData.guests} onValueChange={(value) => handleInputChange("guests", value)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select guests" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tablePreference" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Table Preference
              </Label>
              <Select
                value={reservationData.tablePreference}
                onValueChange={(value) => handleInputChange("tablePreference", value)}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  {tablePreferences.map((preference) => (
                    <SelectItem key={preference} value={preference}>
                      {preference}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={reservationData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                className="bg-background border-border"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={reservationData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={reservationData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="bg-background border-border"
                />
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <Textarea
              id="specialRequests"
              value={reservationData.specialRequests}
              onChange={(e) => handleInputChange("specialRequests", e.target.value)}
              placeholder="Any dietary restrictions, celebrations, or special requirements..."
              className="bg-background border-border"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={
              isSubmitting ||
              !reservationData.date ||
              !reservationData.time ||
              !reservationData.guests ||
              !reservationData.name ||
              !reservationData.phone ||
              !reservationData.email
            }
            className="w-full"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Confirming Reservation...
              </div>
            ) : (
              "Confirm Reservation"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/hook/useCart"
import { Search, Filter, Star, Clock, Plus, Minus, ShoppingCart, Heart, Info, MapPin, Phone } from "lucide-react"

export default function Hotel() {
  const { id } = useParams()
  const [hotel, setHotel] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart, cart } = useCart()

  const categories = ["All", ...new Set(hotel?.menuItems?.map((item) => item.category))]

  const filteredItems = hotel?.menuItems?.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/hotels/${id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setHotel(data)
      } catch (error) {
        console.error("Error fetching hotel:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHotel()
  }, [id])

  const toggleFavorite = (itemId) => {
    setFavorites((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const getItemQuantityInCart = (itemId) => {
    const cartItem = cart.find((item) => item.id === itemId)
    return cartItem ? cartItem.quantity : 0
  }

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.img,
      quantity: 1,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center text-center p-6">
        <div className="max-w-md">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Hotel not found</h2>
          <p className="text-muted-foreground mb-6">It seems the QR code or link you used is incorrect or expired.</p>
          <Button onClick={() => window.location.reload()} variant="destructive">
            Try rescanning the QR code
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hotel Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">{hotel.name}</h1>
              {hotel.description && <p className="text-muted-foreground mb-3">{hotel.description}</p>}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {hotel.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{hotel.address}</span>
                  </div>
                )}
                {hotel.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{hotel.phone}</span>
                  </div>
                )}
                {hotel.active_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{hotel.active_time}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                Open
              </Badge>
              {hotel.parcel_available && (
                <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Delivery Available
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter by:</span>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="bg-card border border-border flex-wrap h-auto p-1">
            {categories?.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems?.length > 0 ? (
                filteredItems.map((item) => {
                  const quantityInCart = getItemQuantityInCart(item.id)
                  const isFavorite = favorites.includes(item.id)

                  return (
                    <Card
                      key={item.id}
                      className="bg-card border-border hover:shadow-lg transition-all duration-200 group"
                    >
                      <CardHeader className="p-0">
                        <div className="relative">
                          <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center overflow-hidden">
                            {item.img ? (
                              <img
                                src={item.img || "/placeholder.svg"}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            ) : (
                              <div className="text-muted-foreground">
                                <ShoppingCart className="h-12 w-12" />
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 hover:bg-background"
                            onClick={() => toggleFavorite(item.id)}
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                              }`}
                            />
                          </Button>
                          {item.discount && (
                            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                              {item.discount}% OFF
                            </Badge>
                          )}
                          {item.veg !== undefined && (
                            <div className="absolute bottom-2 left-2">
                              <div
                                className={`w-4 h-4 border-2 flex items-center justify-center ${
                                  item.veg ? "border-green-500 bg-green-500/20" : "border-red-500 bg-red-500/20"
                                }`}
                              >
                                <div
                                  className={`w-2 h-2 rounded-full ${item.veg ? "bg-green-500" : "bg-red-500"}`}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg font-semibold text-foreground line-clamp-1">
                            {item.name}
                          </CardTitle>
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm text-muted-foreground">4.5</span>
                          </div>
                        </div>

                        {item.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-foreground">${item.price.toFixed(2)}</span>
                            {item.discount && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${(item.price * (1 + item.discount / 100)).toFixed(2)}
                              </span>
                            )}
                          </div>

                          {quantityInCart > 0 ? (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 bg-transparent"
                                onClick={() => {
                                  // Remove from cart logic would go here
                                }}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="font-medium text-foreground min-w-[20px] text-center">
                                {quantityInCart}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 bg-transparent"
                                onClick={() => handleAddToCart(item)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleAddToCart(item)}
                              className="bg-primary hover:bg-primary/90"
                              disabled={!item.available}
                            >
                              {item.available ? (
                                <>
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add
                                </>
                              ) : (
                                "Unavailable"
                              )}
                            </Button>
                          )}
                        </div>

                        {!item.available && (
                          <Badge variant="outline" className="mt-2 bg-muted text-muted-foreground">
                            Out of Stock
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  )
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? "Try adjusting your search terms" : "No items available in this category"}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

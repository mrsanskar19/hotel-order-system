"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Star, Gift, Trophy, Crown, Zap } from "lucide-react"

export const LoyaltyProgram = ({ userId }) => {
  const [loyaltyData, setLoyaltyData] = useState({
    points: 1250,
    tier: "Gold",
    nextTier: "Platinum",
    pointsToNextTier: 750,
    totalSpent: 2500,
    visitsThisMonth: 8,
    rewards: [
      { id: 1, name: "Free Appetizer", points: 500, available: true },
      { id: 2, name: "10% Off Next Order", points: 300, available: true },
      { id: 3, name: "Free Dessert", points: 400, available: true },
      { id: 4, name: "Free Main Course", points: 1000, available: true },
      { id: 5, name: "VIP Table Reservation", points: 800, available: false },
    ],
    recentActivity: [
      { id: 1, action: "Earned 50 points", date: "2024-01-15", order: "ORD123" },
      { id: 2, action: "Redeemed Free Appetizer", date: "2024-01-10", points: -500 },
      { id: 3, action: "Earned 75 points", date: "2024-01-08", order: "ORD122" },
    ],
  })

  const getTierIcon = (tier) => {
    switch (tier) {
      case "Bronze":
        return <Trophy className="h-5 w-5 text-amber-600" />
      case "Silver":
        return <Star className="h-5 w-5 text-gray-400" />
      case "Gold":
        return <Crown className="h-5 w-5 text-yellow-500" />
      case "Platinum":
        return <Zap className="h-5 w-5 text-purple-500" />
      default:
        return <Star className="h-5 w-5 text-gray-400" />
    }
  }

  const getTierColor = (tier) => {
    switch (tier) {
      case "Bronze":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      case "Silver":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      case "Gold":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Platinum":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const redeemReward = (rewardId, pointsCost) => {
    if (loyaltyData.points >= pointsCost) {
      setLoyaltyData((prev) => ({
        ...prev,
        points: prev.points - pointsCost,
        rewards: prev.rewards.map((reward) => (reward.id === rewardId ? { ...reward, available: false } : reward)),
        recentActivity: [
          {
            id: Date.now(),
            action: `Redeemed ${prev.rewards.find((r) => r.id === rewardId)?.name}`,
            date: new Date().toISOString().split("T")[0],
            points: -pointsCost,
          },
          ...prev.recentActivity,
        ].slice(0, 10),
      }))
    }
  }

  const progressToNextTier = ((2000 - loyaltyData.pointsToNextTier) / 2000) * 100

  return (
    <div className="space-y-6">
      {/* Loyalty Status Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Loyalty Status</CardTitle>
            <Badge variant="outline" className={getTierColor(loyaltyData.tier)}>
              {getTierIcon(loyaltyData.tier)}
              <span className="ml-1">{loyaltyData.tier}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-accent/50 rounded-lg">
              <p className="text-2xl font-bold text-primary">{loyaltyData.points}</p>
              <p className="text-sm text-muted-foreground">Points</p>
            </div>
            <div className="text-center p-3 bg-accent/50 rounded-lg">
              <p className="text-2xl font-bold text-green-400">{loyaltyData.visitsThisMonth}</p>
              <p className="text-sm text-muted-foreground">Visits This Month</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress to {loyaltyData.nextTier}</span>
              <span className="text-foreground">{loyaltyData.pointsToNextTier} points to go</span>
            </div>
            <Progress value={progressToNextTier} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Available Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loyaltyData.rewards
              .filter((reward) => reward.available && loyaltyData.points >= reward.points)
              .map((reward) => (
                <div
                  key={reward.id}
                  className="p-4 bg-accent/50 rounded-lg border border-border hover:bg-accent/70 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{reward.name}</h4>
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                      {reward.points} pts
                    </Badge>
                  </div>
                  <Button size="sm" onClick={() => redeemReward(reward.id, reward.points)} className="w-full">
                    Redeem
                  </Button>
                </div>
              ))}
          </div>

          {loyaltyData.rewards.filter((reward) => reward.available && loyaltyData.points >= reward.points).length ===
            0 && (
            <div className="text-center py-8">
              <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No rewards available</p>
              <p className="text-sm text-muted-foreground">Keep earning points to unlock rewards!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loyaltyData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.date).toLocaleDateString()}
                    {activity.order && ` • ${activity.order}`}
                  </p>
                </div>
                {activity.points && (
                  <Badge
                    variant="outline"
                    className={
                      activity.points > 0
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }
                  >
                    {activity.points > 0 ? "+" : ""}
                    {activity.points} pts
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

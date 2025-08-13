import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Route, DollarSign, ShoppingCart, PieChart } from "lucide-react";
import type { DashboardMetrics } from "@shared/schema";

export default function MetricsCards() {
  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  const cards = [
    {
      title: "SL Đã Bán hôm nay",
      value: metrics.dailyBookings?.toLocaleString() || "0",
      change: metrics.dailyBookingsChange,
      changeType: "customers", // Hiển thị số khách thay vì phần trăm
      icon: Route,
      color: "blue",
      testId: "metric-daily-bookings"
    },
    {
      title: "Doanh Thu Hôm Nay",
      value: metrics.dailyRevenue,
      change: metrics.dailyRevenueChange,
      changeType: "percentage",
      icon: DollarSign,
      color: "green",
      testId: "metric-daily-revenue"
    },
    {
      title: "Mục tiêu lượt khách",
      value: `${metrics.toursSoldPlanPercentage || 0}%`,
      change: metrics.toursSold.toLocaleString(),
      changeType: "tours_sold_total", // Hiển thị tổng SL đã bán
      icon: ShoppingCart,
      color: "amber",
      testId: "metric-tours-sold"
    },
    {
      title: "Mục tiêu Doanh Thu",
      value: `${metrics.revenuePlanPercentage || 0}%`,
      change: metrics.revenue || metrics.dailyRevenue,
      changeType: "revenue_total", // Hiển thị tổng doanh thu
      icon: PieChart,
      color: "purple",
      testId: "metric-revenue"
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-100 text-brand-blue";
      case "green": return "bg-green-100 text-brand-green";
      case "amber": return "bg-amber-100 text-brand-amber";
      case "purple": return "bg-purple-100 text-brand-purple";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        const changeValue = typeof card.change === 'number' ? card.change : 0;
        const isPositive = card.change !== null && changeValue > 0;
        const isNegative = card.change !== null && changeValue < 0;
        
        return (
          <Card key={index} className="bg-white rounded-xl shadow-sm border border-gray-200" data-testid={card.testId}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  {card.change !== null && (
                    <div className="flex items-center mt-1">
                      {!["revenue_total", "tours_sold_total"].includes(card.changeType) && isPositive && <TrendingUp className="w-4 h-4 text-brand-green mr-1" />}
                      {!["revenue_total", "tours_sold_total"].includes(card.changeType) && isNegative && <TrendingDown className="w-4 h-4 text-brand-red mr-1" />}
                      <span className={`text-sm font-medium ${
                        card.changeType === "revenue_total" ? 'text-purple-600' :
                        card.changeType === "tours_sold_total" ? 'text-emerald-600' :
                        isPositive ? 'text-brand-green' : 
                        isNegative ? 'text-brand-red' : 'text-gray-600'
                      }`}>
                        {card.changeType === "customers" ? (
                          `${isPositive ? '+' : ''}${changeValue} khách so với hôm qua`
                        ) : card.changeType === "plan_percentage" ? (
                          `= ${changeValue}% kế hoạch`
                        ) : card.changeType === "revenue_total" ? (
                          `${card.change}`
                        ) : card.changeType === "tours_sold_total" ? (
                          `${card.change}`
                        ) : (
                          `${isPositive ? '+' : ''}${changeValue}% so với kế hoạch`
                        )}
                      </span>
                    </div>
                  )}
                  {card.title === "Tỷ Lệ Hoàn Thành" && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-brand-blue h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${metrics.completionRate}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(card.color)}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

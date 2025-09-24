import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Route, DollarSign, ShoppingCart, PieChart } from "lucide-react";
import type { DashboardMetrics } from "@shared/schema";

interface MetricsCardsProps {
  displayMode: 'sales' | 'revenue';
  dateFilterType?: 'week' | 'month' | 'year';
  dateFilterValues?: number[];
}

export default function MetricsCards({ displayMode, dateFilterType = 'week', dateFilterValues = [] }: MetricsCardsProps) {
  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Tạo title động dựa trên date filter
  const getRightSectionTitle = () => {
    const currentYear = new Date().getFullYear();
    
    if (dateFilterType === 'week') {
      if (dateFilterValues.length > 0) {
        const weekNumbers = dateFilterValues.sort((a, b) => a - b);
        if (weekNumbers.length === 1) {
          return `Lũy kế tính đến ngày hôm nay của Tuần ${weekNumbers[0]} - năm ${currentYear}`;
        } else {
          return `Lũy kế tính đến ngày hôm nay của Tuần ${weekNumbers[0]}-${weekNumbers[weekNumbers.length - 1]} - năm ${currentYear}`;
        }
      }
      return `Lũy kế tính đến ngày hôm nay của Tuần - năm ${currentYear}`;
    } else if (dateFilterType === 'month') {
      if (dateFilterValues.length > 0) {
        const monthNumbers = dateFilterValues.sort((a, b) => a - b);
        if (monthNumbers.length === 1) {
          return `Lũy kế tính đến ngày hôm nay của Tháng ${monthNumbers[0]} - năm ${currentYear}`;
        } else {
          return `Lũy kế tính đến ngày hôm nay của Tháng ${monthNumbers[0]}-${monthNumbers[monthNumbers.length - 1]} - năm ${currentYear}`;
        }
      }
      return `Lũy kế tính đến ngày hôm nay của Tháng - năm ${currentYear}`;
    } else {
      return `Lũy kế tính đến ngày hôm nay của Năm ${currentYear}`;
    }
  };

  // Helper function để tạo text cho kỳ so sánh
  const getPeriodText = () => {
    if (dateFilterType === 'week') {
      if (dateFilterValues.length > 0) {
        const weekNumbers = dateFilterValues.sort((a, b) => a - b);
        if (weekNumbers.length === 1) {
          return `tuần ${weekNumbers[0]}`;
        } else {
          return `tuần ${weekNumbers[0]}-${weekNumbers[weekNumbers.length - 1]}`;
        }
      }
      return 'tuần';
    } else if (dateFilterType === 'month') {
      if (dateFilterValues.length > 0) {
        const monthNumbers = dateFilterValues.sort((a, b) => a - b);
        if (monthNumbers.length === 1) {
          return `tháng ${monthNumbers[0]}`;
        } else {
          return `tháng ${monthNumbers[0]}-${monthNumbers[monthNumbers.length - 1]}`;
        }
      }
      return 'tháng';
    } else {
      const currentYear = new Date().getFullYear();
      return `năm ${currentYear}`;
    }
  };

  if (isLoading) {
    if (displayMode === 'revenue') {
      // Revenue mode loading: Tất cả cards trong 1 hàng
      return (
        <div>
          <div className="mb-4">
            <div className="h-6 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
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
        </div>
      );
    }

    return (
      <div className="flex gap-8">
        {/* Bên trái - Loading */}
        <div className="flex-1">
          <div className="mb-4">
            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
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
        </div>

        {/* Vách ngăn - chỉ hiển thị khi không phải revenue mode */}
        {displayMode !== 'revenue' && <div className="w-px bg-gray-300"></div>}

        {/* Bên phải - Loading - chỉ hiển thị khi không phải revenue mode */}
        {displayMode !== 'revenue' && (
          <div className="flex-1">
            <div className="mb-4">
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i + 2} className="animate-pulse">
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
          </div>
        )}
      </div>
    );
  }

  if (!metrics) return null;

  interface CardProps {
    title: string;
    value: string;
    change?: string | number;
    changeType: string;
    icon: any;
    color: string;
    testId: string;
    detailLabel?: string;
    detailValue?: string;
  }

  const cards: CardProps[] = [
    {
      title: displayMode === 'revenue' ? "Số lượng Đã bán" : "SL Đã Bán hôm nay",
      value: displayMode === 'revenue' ? metrics.toursSold.toLocaleString() : (metrics.dailyBookings?.toLocaleString() || "0"),
      change: displayMode === 'revenue' ? metrics.weeklyBookingsChange : metrics.dailyBookingsChange,
      changeType: "customers", // Hiển thị số khách thay vì phần trăm
      icon: Route,
      color: "blue",
      testId: "metric-daily-bookings"
    },
    {
      title: displayMode === 'revenue' ? "Doanh Thu lũy kế" : "Doanh Số Hôm Nay",
      value: displayMode === 'revenue' ? `${(parseFloat(metrics.revenue?.replace(/[^\d.]/g, '') || '0') / 1000000).toLocaleString()}Tr VND` : `${(parseFloat(metrics.dailyRevenue?.replace(/[^\d.]/g, '') || '0') / 1000000).toLocaleString()}Tr VND`,
      change: displayMode === 'revenue' ? metrics.weeklyRevenueChange : metrics.dailyRevenueChange,
      changeType: displayMode === 'revenue' ? "revenue_weekly" : "percentage",
      icon: DollarSign,
      color: "green",
      testId: "metric-daily-revenue"
    },
    {
      title: "Mục tiêu lượt khách đạt",
      value: `${metrics.toursSoldPlanPercentage || 0}% Kế hoạch`,
      change: metrics.toursSold.toLocaleString(),
      changeType: "tours_sold_total", // Hiển thị tổng SL đã bán
      icon: ShoppingCart,
      color: "amber",
      testId: "metric-tours-sold",
      detailLabel: "Lượt khách",
      detailValue: `${metrics.toursSold.toLocaleString()} / ${metrics.toursSoldPlanned?.toLocaleString() || '0'} LK`
    },
    {
      title: displayMode === 'revenue' ? "Mục tiêu Doanh Thu đạt" : "Mục tiêu Doanh Số đạt",
      value: `${metrics.revenuePlanPercentage || 0}% Kế hoạch`,
      change: metrics.revenue || metrics.dailyRevenue,
      changeType: "revenue_total", // Hiển thị tổng doanh số
      icon: PieChart,
      color: "purple",
      testId: "metric-revenue",
      detailLabel: displayMode === 'revenue' ? "Doanh thu" : "Doanh số",
      detailValue: `${(parseFloat(metrics.revenue?.replace(/[^\d.]/g, '') || '0') / 1000000).toLocaleString()} / ${(parseFloat(metrics.revenuePlanned?.replace(/[^\d.]/g, '') || '0') / 1000000).toLocaleString()}Tr VND`
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

  // Chia cards thành 2 nhóm
  const leftCards = displayMode === 'revenue' ? cards : cards.slice(0, 2); // Nếu revenue mode thì tất cả cards ở bên trái
  const rightCards = displayMode === 'revenue' ? [] : cards.slice(2, 4); // Nếu revenue mode thì không có cards bên phải

  const renderCard = (card: CardProps, index: number) => {
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
              {card.detailLabel && card.detailValue ? (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-800">
                    <span className="text-xs text-gray-500">{card.detailLabel}:</span> 
                    <span className="ml-1 font-semibold">{card.detailValue}</span>
                  </p>
                </div>
              ) : card.change !== null ? (
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
                      displayMode === 'revenue' ? 
                        `${isPositive ? '+' : ''}${changeValue} khách so với cùng kỳ` :
                        `${isPositive ? '+' : ''}${changeValue} khách so với hôm qua`
                    ) : card.changeType === "plan_percentage" ? (
                      `= ${changeValue}% kế hoạch`
                    ) : card.changeType === "revenue_weekly" ? (
                      `${isPositive ? '+' : ''}${(changeValue / 1000).toLocaleString()}tr VNĐ so với cùng kỳ`
                    ) : card.changeType === "revenue_total" ? (
                      `${card.change}`
                    ) : card.changeType === "tours_sold_total" ? (
                      `${card.change}`
                    ) : (
                      `${isPositive ? '+' : ''}${changeValue}% so với kế hoạch ${getPeriodText()}`
                    )}
                  </span>
                </div>
              ) : null}
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
  };

  if (displayMode === 'revenue') {
    // Revenue mode: Hiển thị tất cả cards trong 1 phần, không có vách ngăn
    return (
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900" data-testid="section-title-left">
            {getRightSectionTitle()}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => renderCard(card, index))}
        </div>
      </div>
    );
  }

  // Sales mode: Layout 2 phần như cũ
  return (
    <div className="flex gap-8">
      {/* Bên trái */}
      <div className="flex-1">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900" data-testid="section-title-left">
            Thống Kê theo Ngày
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leftCards.map((card, index) => renderCard(card, index))}
        </div>
      </div>

      {/* Vách ngăn */}
      <div className="w-px bg-gray-300" data-testid="divider"></div>

      {/* Bên phải */}
      <div className="flex-1">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900" data-testid="section-title-right">
            {getRightSectionTitle()}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rightCards.map((card, index) => renderCard(card, index + 2))}
        </div>
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Tour } from "@shared/schema";
import { useState } from "react";

interface TopToursPanelProps {
  displayMode: 'sales' | 'revenue';
  dateFilterType?: 'week' | 'month' | 'year' | 'day' | 'custom';
  dateFilterValues?: number[];
  selectedDay?: Date;
  dateRange?: { from: Date; to?: Date };
}

export default function TopToursPanel({ displayMode, dateFilterType = 'week', dateFilterValues = [], selectedDay, dateRange }: TopToursPanelProps) {
  const [showAll, setShowAll] = useState(false);
  const { data: tours = [], isLoading } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
    refetchInterval: 30000,
  });

  // Get top 10 tours by sold count
  const allTopTours = tours.sort((a, b) => b.sold - a.sold).slice(0, 10);

  // Show only 5 initially, or all if showAll is true
  const topTours = showAll ? allTopTours : allTopTours.slice(0, 5);

  // Format date period text based on filter type and values
  const getDatePeriodText = () => {
    if (dateFilterValues.length === 0 && !['day', 'custom'].includes(dateFilterType)) return "";
    
    switch (dateFilterType) {
      case 'week':
        return ` - Tuần ${dateFilterValues[0]}`;
      case 'month':
        return ` - Tháng ${dateFilterValues[0]}`;
      case 'year':
        return ` - Năm ${dateFilterValues[0]}`;
      case 'day':
        return ` - Ngày ${dateFilterValues[0]}`;
      case 'custom':
        return ` - ${dateFilterValues[0]}`;
      default:
        return "";
    }
  };

  const getRegionLabel = (region: string) => {
    switch (region) {
      case "mien_bac":
        return "Miền Bắc";
      case "mien_trung":
        return "Miền Trung";
      case "mien_nam":
        return "Miền Nam";
      case "chau_a":
        return "Châu Á";
      case "chau_au":
        return "Châu Âu";
      default:
        return region;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle>Top 10 Tuyến Tour Bán Chạy{getDatePeriodText()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                  <div className="h-3 bg-gray-200 rounded w-8"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="bg-white rounded-xl shadow-sm border border-gray-200"
      data-testid="top-tours-panel"
    >
      <CardHeader className="px-6 py-4 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {showAll ? "Top 10" : "Top 5"} Tuyến Tour Bán Chạy{getDatePeriodText()}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {topTours.map((tour, index) => (
          <div
            key={tour.id}
            className="flex items-center space-x-3"
            data-testid={`top-tour-${index}`}
          >
            <div className="flex-shrink-0">
              {tour.imageUrl ? (
                <img
                  src={tour.imageUrl}
                  alt={tour.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500">#{index + 1}</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p
                className="text-sm font-medium text-gray-900 line-clamp-1"
                title={tour.name}
              >
                {tour.name}
              </p>
              <p className="text-xs text-gray-500">
                {getRegionLabel(tour.geoRegion || tour.area)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {tour.sold.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Khách</p>
            </div>
          </div>
        ))}

        {topTours.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Không có dữ liệu tour</p>
          </div>
        )}

        {/* Show More / Show Less Button */}
        {allTopTours.length > 5 && (
          <div className="text-center pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              {showAll
                ? "Thu gọn"
                : `Xem thêm (${allTopTours.length - 5} tour)`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

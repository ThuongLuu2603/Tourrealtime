import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RegionalPerformance } from "@shared/schema";

export default function RegionalPerformance() {
  const { data: performance = [], isLoading } = useQuery<RegionalPerformance[]>({
    queryKey: ["/api/regional-performance"],
    refetchInterval: 30000,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-brand-green';
      case 'moderate': return 'bg-brand-amber';
      case 'poor': return 'bg-brand-red';
      default: return 'bg-gray-400';
    }
  };

  const averagePerformance = performance.length > 0 
    ? (performance.reduce((sum, item) => sum + parseFloat(item.performanceRate), 0) / performance.length).toFixed(1)
    : '0.0';

  if (isLoading) {
    return (
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle>Hiệu Suất Doanh Số KH Theo Khu Vực</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200" data-testid="regional-performance">
      <CardHeader className="px-6 py-4 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Hiệu Suất Doanh Số Theo Khu Vực
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {performance.map((item) => (
          <div key={item.id} className="space-y-3" data-testid={`region-perf-${item.cityName.replace(/\s+/g, '-').toLowerCase()}`}>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{item.cityName}</span>
              <span className="text-sm font-semibold text-gray-900">{parseFloat(item.performanceRate).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(item.status)}`}
                style={{ width: `${parseFloat(item.performanceRate)}%` }}
              ></div>
            </div>
          </div>
        ))}
        
        {performance.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">Trung bình toàn quốc:</span>
              <span className="text-sm font-bold text-brand-blue">{averagePerformance}%</span>
            </div>
          </div>
        )}

        {performance.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Không có dữ liệu hiệu suất</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

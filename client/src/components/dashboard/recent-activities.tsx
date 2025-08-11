import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Activity } from "@shared/schema";

export default function RecentActivities() {
  const { data: activities = [], isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
    refetchInterval: 10000, // Refresh every 10 seconds for recent activities
  });

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'booking': return 'bg-brand-green';
      case 'price_update': return 'bg-brand-amber';
      case 'new_tour': return 'bg-brand-blue';
      default: return 'bg-gray-400';
    }
  };

  const formatTimeAgo = (timestamp: string | Date | null) => {
    if (!timestamp) return 'Vừa xong';
    
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  if (isLoading) {
    return (
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle>Hoạt Động Gần Đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200" data-testid="recent-activities">
      <CardHeader className="px-6 py-4 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Hoạt Động Gần Đây
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className="flex items-start space-x-3 slide-up"
            data-testid={`activity-${index}`}
          >
            <div 
              className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full mt-2 flex-shrink-0`}
            ></div>
            <div>
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500">
                {formatTimeAgo(activity.timestamp)} • {activity.location}
              </p>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Không có hoạt động gần đây</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MetricsCards from "@/components/dashboard/metrics-cards";
import TourTable from "@/components/dashboard/tour-table";
import TopToursPanel from "@/components/dashboard/top-tours-panel";
import RegionalPerformance from "@/components/dashboard/regional-performance";
import RecentActivities from "@/components/dashboard/recent-activities";
import DateFilterDropdown from "@/components/dashboard/date-filter-dropdown";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSpreadsheet, Clock } from "lucide-react";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("7");

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto refresh data every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const refreshTimer = setInterval(() => {
      // Refetch data here if needed
    }, 10000);
    
    return () => clearInterval(refreshTimer);
  }, [autoRefresh]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export functionality
    console.log("Exporting to Excel...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900" data-testid="dashboard-title">
                Dashboard Tour Realtime
              </h1>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-brand-green rounded-full pulse-green"></div>
                <span className="text-sm text-gray-600 font-medium" data-testid="live-status">Live Updates</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span data-testid="current-time">{formatTime(currentTime)}</span>
                <span className="ml-2">| Cập nhật: 9s trước</span>
              </div>
              
              <DateFilterDropdown 
                onSelectionChange={(type, values) => {
                  console.log(`Selected ${type}:`, values);
                  // Handle date filter change here
                }}
              />
              
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-32" data-testid="month-selector">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Năm 2025</SelectItem>
                  <SelectItem value="6">Năm 2026</SelectItem>
                  <SelectItem value="5">Năm 2027</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleExportExcel}
                className="bg-brand-blue hover:bg-blue-600"
                data-testid="button-export-excel"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Xuất Excel
              </Button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Auto-refresh:</span>
                <Button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    autoRefresh 
                      ? 'bg-brand-green hover:bg-green-600 text-white' 
                      : 'bg-gray-400 hover:bg-gray-500 text-white'
                  }`}
                  data-testid="button-auto-refresh"
                >
                  {autoRefresh ? 'ON' : 'OFF'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Key Metrics Cards */}
        <MetricsCards />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mt-8">
          {/* Main Dashboard Table */}
          <div className="xl:col-span-3">
            <TourTable />
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            <TopToursPanel />
            <RegionalPerformance />
            <RecentActivities />
          </div>
        </div>
      </main>
    </div>
  );
}

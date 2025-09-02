import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { Tour, HierarchyLevel, SalesUnit } from "@shared/schema";

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'name' | 'planned' | 'sold' | 'remaining' | 'completionRate' | 'revenue';

interface SortState {
  field: SortField;
  direction: SortDirection;
}

export default function HierarchicalTourTable() {
  const [expandedSections, setExpandedSections] = useState({
    domestic: false,
    international: false
  });

  const [sortState, setSortState] = useState<SortState>({
    field: 'name',
    direction: null
  });

  const { data: tours = [], isLoading: toursLoading } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
    refetchInterval: 5000,
  });

  const { data: hierarchyLevels = [], isLoading: hierarchyLoading } = useQuery<HierarchyLevel[]>({
    queryKey: ["/api/hierarchy-levels"],
    refetchInterval: 5000,
  });

  const { data: salesUnits = [] } = useQuery<SalesUnit[]>({
    queryKey: ["/api/sales-units"],
    refetchInterval: 30000,
  });

  const getSalesUnitName = (code: string) => {
    const unit = salesUnits.find(u => u.code === code);
    return unit ? unit.name : code;
  };

  // Fixed sales unit mapping for areas
  const getAreaTopSalesUnit = (areaCode: string) => {
    const areaToSalesUnitMap: Record<string, string> = {
      'nhat_ban': 'HCM',
      'han_quoc': 'HCM', 
      'singapore_malaysia': 'HN',
      'trung_quoc': 'HN',
      'thai_lan': 'HCM',
      'indonesia': 'HN',
      'mongolia': 'CT',
      'lao': 'HCM',
      'campuchia': 'HN',
      // Domestic areas
      'dbsh_dh': 'HN',
      'dong_nam_bo': 'HCM'
    };
    
    return areaToSalesUnitMap[areaCode] || 'HCM';
  };

  const toggleExpansion = (section: 'domestic' | 'international') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSort = (field: SortField) => {
    setSortState(prevState => {
      if (prevState.field === field) {
        // Cycle through: null -> asc -> desc -> null
        const newDirection = 
          prevState.direction === null ? 'asc' :
          prevState.direction === 'asc' ? 'desc' : null;
        return { field, direction: newDirection };
      } else {
        // New field starts with asc
        return { field, direction: 'asc' };
      }
    });
  };

  const getSortIcon = (field: SortField) => {
    if (sortState.field !== field || sortState.direction === null) {
      return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
    }
    return sortState.direction === 'asc' ? 
      <ArrowUp className="w-3 h-3 text-blue-500" /> : 
      <ArrowDown className="w-3 h-3 text-blue-500" />;
  };

  const sortAreas = (areas: HierarchyLevel[]) => {
    if (sortState.direction === null) return areas;
    
    return [...areas].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortState.field) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'planned':
          aValue = a.planned;
          bValue = b.planned;
          break;
        case 'sold':
          aValue = a.sold;
          bValue = b.sold;
          break;
        case 'remaining':
          aValue = a.remaining;
          bValue = b.remaining;
          break;
        case 'completionRate':
          aValue = parseFloat(a.completionRate);
          bValue = parseFloat(b.completionRate);
          break;
        case 'revenue':
          aValue = parseFloat(a.revenue);
          bValue = parseFloat(b.revenue);
          break;
        default:
          return 0;
      }
      
      if (typeof aValue === 'string') {
        return sortState.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortState.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });
  };

  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return (numValue / 1000000).toFixed(0);
  };

  const getCompletionRateColor = (rate: string) => {
    const numRate = parseFloat(rate);
    if (numRate >= 85) return "text-brand-green";
    if (numRate >= 70) return "text-brand-blue";
    if (numRate >= 50) return "text-brand-amber";
    return "text-red-500";
  };

  // Organize data by category and levels
  const domesticRoot = hierarchyLevels.find(l => l.code === 'noi_dia');
  const internationalRoot = hierarchyLevels.find(l => l.code === 'tour_quoc_te');
  
  const domesticAreas = sortAreas(hierarchyLevels.filter(l => 
    l.category === 'domestic' && l.level === 'area'
  ));
  
  const internationalAreas = sortAreas(hierarchyLevels.filter(l => 
    l.category === 'international' && l.level === 'area'
  ));

  // Group tours by area
  const toursByArea = useMemo(() => {
    return tours.reduce((acc, tour) => {
      if (!acc[tour.area]) {
        acc[tour.area] = [];
      }
      acc[tour.area].push(tour);
      return acc;
    }, {} as Record<string, Tour[]>);
  }, [tours]);

  if (toursLoading || hierarchyLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200" data-testid="hierarchical-tour-table">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Tráo Cáo Tour Theo Cấu Trúc Phân Cấp
        </h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                    data-testid="sort-name"
                  >
                    <span>Tuyến Tour</span>
                    {getSortIcon('name')}
                  </button>
                </th>
                <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('planned')}
                    className="flex items-center justify-center space-x-1 hover:text-gray-700 w-full"
                    data-testid="sort-planned"
                  >
                    <span>Kế Hoạch</span>
                    {getSortIcon('planned')}
                  </button>
                </th>
                <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('sold')}
                    className="flex items-center justify-center space-x-1 hover:text-gray-700 w-full"
                    data-testid="sort-sold"
                  >
                    <span>Đã Trán</span>
                    {getSortIcon('sold')}
                  </button>
                </th>
                <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('remaining')}
                    className="flex items-center justify-center space-x-1 hover:text-gray-700 w-full"
                    data-testid="sort-remaining"
                  >
                    <span>SL KH Còn Lại</span>
                    {getSortIcon('remaining')}
                  </button>
                </th>
                <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đặt Gần Đây (30 phút)
                </th>
                <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('completionRate')}
                    className="flex items-center justify-center space-x-1 hover:text-gray-700 w-full"
                    data-testid="sort-completion"
                  >
                    <span>% DS KH</span>
                    {getSortIcon('completionRate')}
                  </button>
                </th>
                <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('revenue')}
                    className="flex items-center justify-center space-x-1 hover:text-gray-700 w-full"
                    data-testid="sort-revenue"
                  >
                    <span>DT Hôm Nay</span>
                    {getSortIcon('revenue')}
                  </button>
                </th>
                <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">% DS KH</th>
                <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn Vị Top 1</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              
              {/* Domestic Section */}
              {domesticRoot && (
                <tr className="bg-blue-50 hover:bg-blue-100 cursor-pointer" onClick={() => toggleExpansion('domestic')}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {expandedSections.domestic ? 
                        <ChevronDown className="w-4 h-4 text-blue-600 mr-2" /> : 
                        <ChevronRight className="w-4 h-4 text-blue-600 mr-2" />
                      }
                      <div className="w-3 h-3 bg-brand-green rounded-full mr-2"></div>
                      <span className="font-semibold text-gray-900">{domesticRoot.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-semibold text-gray-900">
                    {domesticRoot.planned.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-semibold text-gray-900">
                    {domesticRoot.sold.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-semibold text-brand-amber">
                    {domesticRoot.remaining.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="bg-brand-blue text-white px-2 py-1 rounded-full text-xs font-medium blink">
                      +{domesticRoot.recentlyBooked}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-semibold text-brand-green">
                    {parseFloat(domesticRoot.completionRate).toFixed(1)}%
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-semibold text-gray-900">
                    {formatCurrency(domesticRoot.revenue)}Tr
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-brand-green font-medium">+{parseFloat(domesticRoot.targetPercentage).toFixed(1)}%</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="w-3 h-3 bg-brand-green rounded-full mx-auto"></div>
                  </td>
                </tr>
              )}

              {/* Domestic Areas */}
              {expandedSections.domestic && domesticAreas.map((area) => (
                <tr key={area.id} className="hover:bg-gray-50" data-testid={`area-${area.code}`}>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center pl-8">
                      <ChevronRight className="w-3 h-3 text-gray-300 mr-2" />
                      <span className="font-medium text-gray-700">{area.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">{area.planned.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">{area.sold.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-sm text-brand-amber">{area.remaining.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      +{area.recentlyBooked}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-center text-sm font-medium ${getCompletionRateColor(area.completionRate)}`}>
                    {parseFloat(area.completionRate).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">{formatCurrency(area.revenue)}Tr</td>
                  <td className="px-4 py-3 text-center text-sm text-brand-green">+{parseFloat(area.targetPercentage).toFixed(1)}%</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {getSalesUnitName(getAreaTopSalesUnit(area.code))}
                    </span>
                  </td>
                </tr>
              ))}

              {/* International Section */}
              {internationalRoot && (
                <tr className="bg-orange-50 hover:bg-orange-100 cursor-pointer" onClick={() => toggleExpansion('international')}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {expandedSections.international ? 
                        <ChevronDown className="w-4 h-4 text-orange-600 mr-2" /> : 
                        <ChevronRight className="w-4 h-4 text-orange-600 mr-2" />
                      }
                      <div className="w-3 h-3 bg-brand-green rounded-full mr-2"></div>
                      <span className="font-semibold text-gray-900">{internationalRoot.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-semibold text-gray-900">
                    {internationalRoot.planned.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-semibold text-gray-900">
                    {internationalRoot.sold.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-semibold text-brand-amber">
                    {internationalRoot.remaining.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="bg-brand-blue text-white px-2 py-1 rounded-full text-xs font-medium blink">
                      +{internationalRoot.recentlyBooked}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-semibold text-brand-green">
                    {parseFloat(internationalRoot.completionRate).toFixed(1)}%
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-semibold text-gray-900">
                    {formatCurrency(internationalRoot.revenue)}Tr
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-brand-green font-medium">+{parseFloat(internationalRoot.targetPercentage).toFixed(1)}%</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="w-3 h-3 bg-brand-green rounded-full mx-auto"></div>
                  </td>
                </tr>
              )}

              {/* International Areas */}
              {expandedSections.international && internationalAreas.map((area) => (
                <tr key={area.id} className="hover:bg-gray-50" data-testid={`area-${area.code}`}>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center pl-8">
                      <ChevronRight className="w-3 h-3 text-gray-300 mr-2" />
                      <span className="font-medium text-gray-700">{area.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">{area.planned.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">{area.sold.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-sm text-brand-amber">{area.remaining.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      +{area.recentlyBooked}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-center text-sm font-medium ${getCompletionRateColor(area.completionRate)}`}>
                    {parseFloat(area.completionRate).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">{formatCurrency(area.revenue)}Tr</td>
                  <td className="px-4 py-3 text-center text-sm text-brand-green">+{parseFloat(area.targetPercentage).toFixed(1)}%</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {getSalesUnitName(getAreaTopSalesUnit(area.code))}
                    </span>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
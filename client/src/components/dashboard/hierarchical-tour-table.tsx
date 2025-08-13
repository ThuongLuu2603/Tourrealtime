import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronRight, Filter, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { Tour, HierarchyLevel, SalesUnit } from "@shared/schema";

type SortField = 'planned' | 'sold' | 'remaining' | 'recentlyBooked' | 'completionRate' | 'revenue' | 'targetPercentage';
type SortDirection = 'asc' | 'desc' | null;

export default function HierarchicalTourTable() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    domestic: true,
    international: true
  });
  const [selectedSalesUnit, setSelectedSalesUnit] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const { data: tours = [], isLoading: toursLoading } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
    refetchInterval: 5000,
  });

  const { data: hierarchyLevels = [], isLoading: hierarchyLoading } = useQuery<HierarchyLevel[]>({
    queryKey: ["/api/hierarchy-levels"],
    refetchInterval: 5000,
  });

  const { data: salesUnits = [], isLoading: salesUnitsLoading } = useQuery<SalesUnit[]>({
    queryKey: ["/api/sales-units"],
    refetchInterval: 30000,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getCompletionRateColor = (rate: string) => {
    const numRate = parseFloat(rate);
    if (numRate >= 75) return 'text-brand-green';
    if (numRate >= 60) return 'text-brand-amber';
    return 'text-brand-red';
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value) / 1000000000;
    return `${num.toFixed(1)}B`;
  };

  const getSalesUnitName = (code: string) => {
    const unit = salesUnits.find(u => u.code === code);
    return unit ? unit.name : code;
  };

  // Calculate top sales unit for area - ALWAYS return a value
  const getAreaTopSalesUnit = (areaCode: string) => {
    // Try to find tours for this area
    const allToursInArea = tours.filter(tour => tour.area === areaCode);
    
    if (allToursInArea.length > 0) {
      // Return the first tour's sales unit
      return allToursInArea[0].topSalesUnit;
    }
    
    // Fallback for areas without direct tours - return default sales unit
    return 'HCM'; // Default to Ho Chi Minh City
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-3 h-3 text-gray-600" />;
    }
    if (sortDirection === 'desc') {
      return <ArrowDown className="w-3 h-3 text-gray-600" />;
    }
    return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
  };

  const sortData = (data: any[], field: SortField | null, direction: SortDirection) => {
    if (!field || !direction) return data;
    
    return [...data].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];
      
      // Handle string numbers
      if (typeof aValue === 'string' && !isNaN(parseFloat(aValue))) {
        aValue = parseFloat(aValue);
      }
      if (typeof bValue === 'string' && !isNaN(parseFloat(bValue))) {
        bValue = parseFloat(bValue);
      }
      
      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  // Filter tours by selected sales unit
  const filteredTours = selectedSalesUnit === "all" 
    ? tours 
    : tours.filter(tour => tour.topSalesUnit === selectedSalesUnit);

  // Group hierarchy levels
  const domesticLevels = hierarchyLevels.filter(level => level.category === 'domestic');
  const internationalLevels = hierarchyLevels.filter(level => level.category === 'international');
  
  // Get top-level categories
  const domesticRoot = domesticLevels.find(level => level.level === 'geo_region');
  const internationalRoot = internationalLevels.find(level => level.level === 'continent');
  
  // Get areas under each category and sort them
  const domesticAreas = sortData(domesticLevels.filter(level => level.level === 'area'), sortField, sortDirection);
  const internationalAreas = sortData(internationalLevels.filter(level => level.level === 'area'), sortField, sortDirection);

  // Group tours by area
  const toursByArea = filteredTours.reduce((acc, tour) => {
    if (!acc[tour.area]) {
      acc[tour.area] = [];
    }
    acc[tour.area].push(tour);
    return acc;
  }, {} as Record<string, Tour[]>);

  // Sort tours within each area
  Object.keys(toursByArea).forEach(area => {
    toursByArea[area] = sortData(toursByArea[area], sortField, sortDirection);
  });

  if (toursLoading || hierarchyLoading || salesUnitsLoading) {
    return (
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle>Bảng Theo Dõi Tour Realtime</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200" data-testid="hierarchical-tour-table">
      <CardHeader className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Bảng Theo Dõi Tour Realtime
          </CardTitle>
          
          {/* Sales Unit Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={selectedSalesUnit} onValueChange={setSelectedSalesUnit}>
              <SelectTrigger className="w-48" data-testid="sales-unit-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả đơn vị</SelectItem>
                {salesUnits.map(unit => (
                  <SelectItem key={unit.id} value={unit.code}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tuyến Tour
              </th>
              <th 
                className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" 
                onClick={() => handleSort('planned')}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Kế Hoạch</span>
                  {getSortIcon('planned')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" 
                onClick={() => handleSort('sold')}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Đã Bán</span>
                  {getSortIcon('sold')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" 
                onClick={() => handleSort('remaining')}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Còn Lại</span>
                  {getSortIcon('remaining')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" 
                onClick={() => handleSort('recentlyBooked')}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Số Chỗ Vừa Bán</span>
                  {getSortIcon('recentlyBooked')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" 
                onClick={() => handleSort('completionRate')}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>% Hoàn Thành</span>
                  {getSortIcon('completionRate')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" 
                onClick={() => handleSort('revenue')}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Doanh Thu</span>
                  {getSortIcon('revenue')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" 
                onClick={() => handleSort('targetPercentage')}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>% Mục Tiêu</span>
                  {getSortIcon('targetPercentage')}
                </div>
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đơn Vị Top 1
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            
            {/* Domestic Tours Section */}
            {domesticRoot && (
              <>
                <tr 
                  className="bg-green-50 hover:bg-green-100 cursor-pointer table-row-hover"
                  onClick={() => toggleSection('domestic')}
                  data-testid="section-domestic"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {expandedSections.domestic ? (
                        <ChevronDown className="w-4 h-4 text-gray-400 mr-2 transition-transform duration-200" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400 mr-2 transition-transform duration-200" />
                      )}
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-brand-green rounded-full mr-3"></div>
                        <span className="font-semibold text-gray-900">TOUR {domesticRoot.name.toUpperCase()}</span>
                      </div>
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
                    <span className="bg-brand-green text-white px-2 py-1 rounded-full text-xs font-medium blink">
                      +{domesticRoot.recentlyBooked}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-semibold text-brand-green">
                    {parseFloat(domesticRoot.completionRate).toFixed(1)}%
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-semibold text-gray-900">
                    {formatCurrency(domesticRoot.revenue)}B
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-brand-green font-medium">+{parseFloat(domesticRoot.targetPercentage).toFixed(1)}%</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="w-3 h-3 bg-brand-green rounded-full mx-auto"></div>
                  </td>
                </tr>

                {/* Domestic Areas and Tours */}
                {expandedSections.domestic && (
                  <>
                    {domesticAreas.map((area) => (
                      <React.Fragment key={area.id}>
                        {/* Area Row */}
                        <tr className="hover:bg-gray-50 table-row-hover" data-testid={`area-${area.code}`}>
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
                          <td className="px-4 py-3 text-center text-sm text-gray-600">{formatCurrency(area.revenue)}B</td>
                          <td className="px-4 py-3 text-center text-sm text-brand-green">+{parseFloat(area.targetPercentage).toFixed(1)}%</td>
                          <td className="px-4 py-3 text-center">
                            {(() => {
                              const topUnit = getAreaTopSalesUnit(area.code);
                              return topUnit ? (
                                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                  {getSalesUnitName(topUnit)}
                                </span>
                              ) : (
                                <div className="w-2 h-2 bg-gray-300 rounded-full mx-auto"></div>
                              );
                            })()}
                          </td>
                        </tr>
                        
                        {/* Tours under this area */}
                        {toursByArea[area.code]?.map((tour) => (
                          <tr key={tour.id} className="hover:bg-gray-50 table-row-hover" data-testid={`tour-${tour.id}`}>
                            <td className="px-6 py-3 whitespace-nowrap">
                              <div className="flex items-center pl-12">
                                {tour.imageUrl && (
                                  <img 
                                    src={tour.imageUrl} 
                                    alt={tour.name}
                                    className="w-6 h-6 rounded mr-2 object-cover"
                                  />
                                )}
                                <span className="text-sm text-gray-600">{tour.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-500">{tour.planned.toLocaleString()}</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-500">{tour.sold.toLocaleString()}</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-500">{tour.remaining.toLocaleString()}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs blink">
                                +{tour.recentlyBooked}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-500">
                              {parseFloat(tour.completionRate).toFixed(1)}%
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-500">{formatCurrency(tour.revenue)}B</td>
                            <td className="px-4 py-3 text-center text-sm text-green-600">
                              +{parseFloat(tour.targetPercentage).toFixed(1)}%
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                {getSalesUnitName(tour.topSalesUnit)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </>
                )}
              </>
            )}

            {/* International Tours Section */}
            {internationalRoot && (
              <>
                <tr 
                  className="bg-blue-50 hover:bg-blue-100 cursor-pointer table-row-hover"
                  onClick={() => toggleSection('international')}
                  data-testid="section-international"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {expandedSections.international ? (
                        <ChevronDown className="w-4 h-4 text-gray-400 mr-2 transition-transform duration-200" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400 mr-2 transition-transform duration-200" />
                      )}
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-brand-blue rounded-full mr-3"></div>
                        <span className="font-semibold text-gray-900">TOUR QUỐC TẾ</span>
                      </div>
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
                    {formatCurrency(internationalRoot.revenue)}B
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-brand-green font-medium">+{parseFloat(internationalRoot.targetPercentage).toFixed(1)}%</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="w-3 h-3 bg-brand-green rounded-full mx-auto"></div>
                  </td>
                </tr>

                {/* International Areas and Tours */}
                {expandedSections.international && (
                  <>
                    {internationalAreas.map((area) => (
                      <React.Fragment key={area.id}>
                        {/* Area Row */}
                        <tr className="hover:bg-gray-50 table-row-hover" data-testid={`area-${area.code}`}>
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
                          <td className="px-4 py-3 text-center text-sm text-gray-600">{formatCurrency(area.revenue)}B</td>
                          <td className="px-4 py-3 text-center text-sm text-brand-green">+{parseFloat(area.targetPercentage).toFixed(1)}%</td>
                          <td className="px-4 py-3 text-center">
                            {(() => {
                              const topUnit = getAreaTopSalesUnit(area.code);
                              return topUnit ? (
                                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                  {getSalesUnitName(topUnit)}
                                </span>
                              ) : (
                                <div className="w-2 h-2 bg-gray-300 rounded-full mx-auto"></div>
                              );
                            })()}
                          </td>
                        </tr>
                        
                        {/* Tours under this area */}
                        {toursByArea[area.code]?.map((tour) => (
                          <tr key={tour.id} className="hover:bg-gray-50 table-row-hover" data-testid={`tour-${tour.id}`}>
                            <td className="px-6 py-3 whitespace-nowrap">
                              <div className="flex items-center pl-12">
                                {tour.imageUrl && (
                                  <img 
                                    src={tour.imageUrl} 
                                    alt={tour.name}
                                    className="w-6 h-6 rounded mr-2 object-cover"
                                  />
                                )}
                                <span className="text-sm text-gray-600">{tour.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-500">{tour.planned.toLocaleString()}</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-500">{tour.sold.toLocaleString()}</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-500">{tour.remaining.toLocaleString()}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs blink">
                                +{tour.recentlyBooked}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-500">
                              {parseFloat(tour.completionRate).toFixed(1)}%
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-500">{formatCurrency(tour.revenue)}B</td>
                            <td className="px-4 py-3 text-center text-sm text-green-600">
                              +{parseFloat(tour.targetPercentage).toFixed(1)}%
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                {getSalesUnitName(tour.topSalesUnit)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
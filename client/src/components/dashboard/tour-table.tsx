import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronRight, Filter } from "lucide-react";
import type { Tour, HierarchyLevel, SalesUnit } from "@shared/schema";

export default function TourTable() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    domestic: true,
    international: true
  });
  const [expandedContinents, setExpandedContinents] = useState<Record<string, boolean>>({});
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});
  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>({});
  const [selectedSalesUnit, setSelectedSalesUnit] = useState<string>("all");

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

  const toggleContinent = (continentCode: string) => {
    setExpandedContinents(prev => ({
      ...prev,
      [continentCode]: !prev[continentCode]
    }));
  };

  const toggleRegion = (regionCode: string) => {
    setExpandedRegions(prev => ({
      ...prev,
      [regionCode]: !prev[regionCode]
    }));
  };

  const toggleArea = (areaCode: string) => {
    setExpandedAreas(prev => ({
      ...prev,
      [areaCode]: !prev[areaCode]
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

  const handleSalesUnitClick = (unitCode: string) => {
    setSelectedSalesUnit(unitCode);
  };

  // Filter tours by selected sales unit
  const filteredTours = selectedSalesUnit === "all" 
    ? tours 
    : tours.filter(tour => tour.topSalesUnit === selectedSalesUnit);

  // Group hierarchy levels by category and level
  const domesticLevels = hierarchyLevels.filter(level => level.category === 'domestic');
  const internationalLevels = hierarchyLevels.filter(level => level.category === 'international');
  
  // Get top-level categories
  const domesticRoot = domesticLevels.find(level => level.level === 'geo_region');
  const internationalRoot = internationalLevels.find(level => level.level === 'tour_category');
  
  // Get levels for domestic (3 levels)
  const domesticRegions = domesticLevels.filter(level => level.level === 'region');
  const domesticAreas = domesticLevels.filter(level => level.level === 'area');
  
  // Get levels for international (4 levels)
  const internationalContinents = internationalLevels.filter(level => level.level === 'continent');
  const internationalRegions = internationalLevels.filter(level => level.level === 'region');
  const internationalAreas = internationalLevels.filter(level => level.level === 'area');

  // Group tours by area
  const toursByArea = filteredTours.reduce((acc, tour) => {
    if (!acc[tour.area]) {
      acc[tour.area] = [];
    }
    acc[tour.area].push(tour);
    return acc;
  }, {} as Record<string, Tour[]>);

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

  // Create rows data
  const allRows: any[] = [];

  // Add domestic section with 3 levels
  if (domesticRoot) {
    allRows.push({
      type: 'section',
      section: 'domestic',
      data: domesticRoot,
      isExpanded: expandedSections.domestic
    });

    if (expandedSections.domestic) {
      // Level 2: Regions (Miền Bắc, Miền Trung, Miền Nam)
      domesticRegions.forEach(region => {
        allRows.push({
          type: 'region',
          data: region,
          isExpanded: expandedRegions[region.code] ?? true
        });

        // Show areas under this region only if region is expanded
        if (expandedRegions[region.code] !== false) {
          const regionAreas = domesticAreas.filter(area => area.parentCode === region.code);
          regionAreas.forEach(area => {
            allRows.push({
              type: 'area',
              data: area,
              isExpanded: expandedAreas[area.code] ?? true
            });

            // Show tours under this area only if area is expanded
            if (expandedAreas[area.code] !== false) {
              const areaTours = toursByArea[area.code] || [];
              areaTours.forEach(tour => {
                allRows.push({
                  type: 'tour',
                  data: tour
                });
              });
            }
          });
        }
      });
    }
  }

  // Add international section with 3 levels
  if (internationalRoot) {
    allRows.push({
      type: 'section',
      section: 'international',
      data: internationalRoot,
      isExpanded: expandedSections.international
    });

    if (expandedSections.international) {
      // Level 2: Continents (Châu Á)
      internationalContinents.forEach(continent => {
        allRows.push({
          type: 'continent',
          data: continent,
          isExpanded: expandedContinents[continent.code] ?? true
        });

        // Show regions under this continent only if continent is expanded
        if (expandedContinents[continent.code] !== false) {
          const continentRegions = internationalRegions.filter(region => region.parentCode === continent.code);
          
          // Level 3: Regions (Đông Bắc Á, Đông Nam Á)
          continentRegions.forEach(region => {
            allRows.push({
              type: 'region',
              data: region,
              isExpanded: expandedRegions[region.code] ?? true
            });

            // Show areas under this region only if region is expanded
            if (expandedRegions[region.code] !== false) {
              const regionAreas = internationalAreas.filter(area => area.parentCode === region.code);
              
              // Level 4: Areas (Countries) - Final level for international
              regionAreas.forEach(area => {
                allRows.push({
                  type: 'area',
                  data: area,
                  isExpanded: false // No tours to expand for international
                });
                // No tours displayed for international areas - they are the final level
              });
            }
          });
        }
      });
    }
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
        <table className="w-full table-responsive">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '25%'}}>
                Tuyến Tour
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '8%'}}>
                Kế Hoạch
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '8%'}}>
                Đã Bán
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '10%'}}>
                SL KH Còn Lại
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '10%'}}>
                Số Chỗ Vừa Bán
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '9%'}}>
                % Hoàn Thành
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '10%'}}>
                Doanh Số
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '8%'}}>
                % Mục Tiêu
              </th>
              {selectedSalesUnit === "all" && (
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '12%'}}>
                  Đơn Vị Top 1
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allRows.map((row, index) => {
              if (row.type === 'section') {
                const sectionData = row.data;
                const isDomestic = row.section === 'domestic';
                return (
                  <tr 
                    key={`section-${row.section}`}
                    className={`${isDomestic ? 'bg-green-50 hover:bg-green-100' : 'bg-blue-50 hover:bg-blue-100'} cursor-pointer table-row-hover`}
                    onClick={() => toggleSection(row.section)}
                    data-testid={`section-${row.section}`}
                  >
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {row.isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-400 mr-2" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400 mr-2" />
                        )}
                        <div className="flex items-center">
                          <div className={`w-2 h-2 ${isDomestic ? 'bg-brand-green' : 'bg-brand-blue'} rounded-full mr-2`}></div>
                          <span className="font-semibold text-gray-900 text-sm">
                            {isDomestic ? `TOUR ${sectionData.name.toUpperCase()}` : 'TOUR QUỐC TẾ'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-center text-sm font-semibold text-gray-900">
                      {sectionData.planned.toLocaleString()}
                    </td>
                    <td className="px-2 py-3 text-center text-sm font-semibold text-gray-900">
                      {sectionData.sold.toLocaleString()}
                    </td>
                    <td className="px-2 py-3 text-center text-sm font-semibold text-brand-amber">
                      {sectionData.remaining.toLocaleString()}
                    </td>
                    <td className="px-2 py-3 text-center">
                      <span className={`${isDomestic ? 'bg-brand-green' : 'bg-brand-blue'} text-white px-2 py-1 rounded-full text-xs font-medium blink`}>
                        +{sectionData.recentlyBooked}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-center text-sm font-semibold text-brand-green">
                      {parseFloat(sectionData.completionRate).toFixed(1)}%
                    </td>
                    <td className="px-2 py-3 text-center text-sm font-semibold text-gray-900">
                      {formatCurrency(sectionData.revenue)}
                    </td>
                    <td className="px-2 py-3 text-center">
                      <span className="text-brand-green font-medium text-sm">+{parseFloat(sectionData.targetPercentage).toFixed(1)}%</span>
                    </td>
                    {selectedSalesUnit === "all" && (
                      <td className="px-3 py-3 text-center">
                        <div className="w-3 h-3 bg-brand-green rounded-full mx-auto"></div>
                      </td>
                    )}
                  </tr>
                );
              }

              if (row.type === 'continent') {
                const continentData = row.data;
                return (
                  <tr key={`continent-${continentData.id}`} className="hover:bg-gray-50 table-row-hover bg-blue-25 cursor-pointer" data-testid={`continent-${continentData.code}`} onClick={() => toggleContinent(continentData.code)}>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center pl-4">
                        {row.isExpanded ? (
                          <ChevronDown className="w-3 h-3 text-blue-600 mr-2" />
                        ) : (
                          <ChevronRight className="w-3 h-3 text-blue-400 mr-2" />
                        )}
                        <span className="font-semibold text-blue-800 text-sm">{continentData.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-center text-sm font-medium text-blue-700">{continentData.planned.toLocaleString()}</td>
                    <td className="px-2 py-2 text-center text-sm font-medium text-blue-700">{continentData.sold.toLocaleString()}</td>
                    <td className="px-2 py-2 text-center text-sm text-brand-amber font-medium">{continentData.remaining.toLocaleString()}</td>
                    <td className="px-2 py-2 text-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        +{continentData.recentlyBooked}
                      </span>
                    </td>
                    <td className={`px-2 py-2 text-center text-sm font-semibold ${getCompletionRateColor(continentData.completionRate)}`}>
                      {parseFloat(continentData.completionRate).toFixed(1)}%
                    </td>
                    <td className="px-2 py-2 text-center text-sm font-medium text-blue-700">{formatCurrency(continentData.revenue)}</td>
                    <td className="px-2 py-2 text-center text-sm text-brand-green font-medium">+{parseFloat(continentData.targetPercentage).toFixed(1)}%</td>
                    {selectedSalesUnit === "all" && (
                      <td className="px-3 py-2 text-center">
                        <div className="w-2 h-2 bg-brand-green rounded-full mx-auto"></div>
                      </td>
                    )}
                  </tr>
                );
              }

              if (row.type === 'region') {
                const regionData = row.data;
                return (
                  <tr key={`region-${regionData.id}`} className="hover:bg-gray-50 table-row-hover bg-gray-25 cursor-pointer" data-testid={`region-${regionData.code}`} onClick={() => toggleRegion(regionData.code)}>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center pl-8">
                        {row.isExpanded ? (
                          <ChevronDown className="w-3 h-3 text-gray-600 mr-2" />
                        ) : (
                          <ChevronRight className="w-3 h-3 text-gray-400 mr-2" />
                        )}
                        <span className="font-semibold text-gray-800 text-sm">{regionData.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-center text-sm font-medium text-gray-700">{regionData.planned.toLocaleString()}</td>
                    <td className="px-2 py-2 text-center text-sm font-medium text-gray-700">{regionData.sold.toLocaleString()}</td>
                    <td className="px-2 py-2 text-center text-sm text-brand-amber font-medium">{regionData.remaining.toLocaleString()}</td>
                    <td className="px-2 py-2 text-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        +{regionData.recentlyBooked}
                      </span>
                    </td>
                    <td className={`px-2 py-2 text-center text-sm font-semibold ${getCompletionRateColor(regionData.completionRate)}`}>
                      {parseFloat(regionData.completionRate).toFixed(1)}%
                    </td>
                    <td className="px-2 py-2 text-center text-sm font-medium text-gray-700">{formatCurrency(regionData.revenue)}</td>
                    <td className="px-2 py-2 text-center text-sm text-brand-green font-medium">+{parseFloat(regionData.targetPercentage).toFixed(1)}%</td>
                    {selectedSalesUnit === "all" && (
                      <td className="px-3 py-2 text-center">
                        <div className="w-2 h-2 bg-brand-green rounded-full mx-auto"></div>
                      </td>
                    )}
                  </tr>
                );
              }

              if (row.type === 'area') {
                const areaData = row.data;
                const isInternational = areaData.category === 'international';
                
                return (
                  <tr key={`area-${areaData.id}`} className={`hover:bg-gray-50 table-row-hover ${!isInternational ? 'cursor-pointer' : ''}`} data-testid={`area-${areaData.code}`} onClick={!isInternational ? () => toggleArea(areaData.code) : undefined}>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center pl-12">
                        {!isInternational && (
                          row.isExpanded ? (
                            <ChevronDown className="w-3 h-3 text-gray-500 mr-2" />
                          ) : (
                            <ChevronRight className="w-3 h-3 text-gray-300 mr-2" />
                          )
                        )}
                        {isInternational && <div className="w-3 h-3 mr-2"></div>}
                        <span className="font-medium text-gray-700 text-sm">{areaData.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-center text-sm text-gray-600">{areaData.planned.toLocaleString()}</td>
                    <td className="px-2 py-2 text-center text-sm text-gray-600">{areaData.sold.toLocaleString()}</td>
                    <td className="px-2 py-2 text-center text-sm text-brand-amber">{areaData.remaining.toLocaleString()}</td>
                    <td className="px-2 py-2 text-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        +{areaData.recentlyBooked}
                      </span>
                    </td>
                    <td className={`px-2 py-2 text-center text-sm font-medium ${getCompletionRateColor(areaData.completionRate)}`}>
                      {parseFloat(areaData.completionRate).toFixed(1)}%
                    </td>
                    <td className="px-2 py-2 text-center text-sm text-gray-600">{formatCurrency(areaData.revenue)}</td>
                    <td className="px-2 py-2 text-center text-sm text-brand-green">+{parseFloat(areaData.targetPercentage).toFixed(1)}%</td>
                    {selectedSalesUnit === "all" && (
                      <td className="px-3 py-2 text-center">
                        <div className="w-2 h-2 bg-brand-green rounded-full mx-auto"></div>
                      </td>
                    )}
                  </tr>
                );
              }

              if (row.type === 'tour') {
                const tourData = row.data;
                return (
                  <tr key={`tour-${tourData.id}`} className="hover:bg-gray-50 table-row-hover" data-testid={`tour-${tourData.id}`}>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center pl-20">
                        {tourData.imageUrl && (
                          <img 
                            src={tourData.imageUrl} 
                            alt={tourData.name}
                            className="w-6 h-6 rounded mr-2 object-cover"
                          />
                        )}
                        <span className="text-sm text-gray-600">{tourData.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-center text-sm text-gray-500">{tourData.planned.toLocaleString()}</td>
                    <td className="px-2 py-2 text-center text-sm text-gray-500">{tourData.sold.toLocaleString()}</td>
                    <td className="px-2 py-2 text-center text-sm text-gray-500">{tourData.remaining.toLocaleString()}</td>
                    <td className="px-2 py-2 text-center">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs blink">
                        +{tourData.recentlyBooked}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center text-sm text-gray-500">
                      {parseFloat(tourData.completionRate).toFixed(1)}%
                    </td>
                    <td className="px-2 py-2 text-center text-sm text-gray-500">{formatCurrency(tourData.revenue)}</td>
                    <td className="px-2 py-2 text-center text-sm text-green-600">
                      +{parseFloat(tourData.targetPercentage).toFixed(1)}%
                    </td>
                    {selectedSalesUnit === "all" && (
                      <td className="px-3 py-2 text-center">
                        <span 
                          className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded cursor-pointer hover:bg-blue-200 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSalesUnitClick(tourData.topSalesUnit);
                          }}
                          data-testid={`sales-unit-${tourData.topSalesUnit}`}
                        >
                          {getSalesUnitName(tourData.topSalesUnit)}
                        </span>
                      </td>
                    )}
                  </tr>
                );
              }

              return null;
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
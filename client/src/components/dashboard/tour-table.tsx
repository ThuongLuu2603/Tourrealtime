import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronRight, Filter } from "lucide-react";
import type { Tour, HierarchyLevel, SalesUnit } from "@shared/schema";
import { LevelFilter, type LevelFilters } from "./level-filter";
import ColumnCustomizer, { type ColumnConfig } from "./column-customizer";

// Cấu hình cột mặc định
const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: 'tourName', label: 'Tuyến Tour', visible: true, width: '25%', fixed: true },
  { id: 'planned', label: 'Kế Hoạch', visible: true, width: '8%' },
  { id: 'sold', label: 'Đã Bán', visible: true, width: '8%' },
  { id: 'remaining', label: 'SL KH Còn Lại', visible: true, width: '10%' },
  { id: 'recentlyBooked', label: 'Số Chỗ Bán Hôm Nay', visible: true, width: '10%' },
  { id: 'completionRate', label: '% LK Hoàn Thành', visible: true, width: '9%' },
  { id: 'dailyRevenue', label: 'Doanh Thư Hôm Nay', visible: true, width: '10%' },
  { id: 'revenue', label: 'Doanh Số', visible: false, width: '10%' }, // Mặc định ẩn
  { id: 'plannedRevenue', label: 'Doanh Số Kế Hoạch', visible: false, width: '10%' }, // Mặc định ẩn
  { id: 'targetPercentage', label: '% DS KH', visible: true, width: '8%' },
  { id: 'topSalesUnit', label: 'Đơn Vị Top 1', visible: true, width: '12%' },
];

export default function TourTable() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    domestic: true,
    international: true
  });
  const [expandedContinents, setExpandedContinents] = useState<Record<string, boolean>>({});
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});
  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>({});
  const [selectedSalesUnit, setSelectedSalesUnit] = useState<string>("all");
  const [levelFilters, setLevelFilters] = useState<LevelFilters>({
    level1: { domestic: false, international: false },
    level2: { domestic: false, international: false },
    level3: { domestic: false, international: false }
  });
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);

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
    const percentage = parseFloat(rate);
    if (percentage > 75) return 'text-green-600';
    if (percentage > 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompletionRateBackground = (rate: string) => {
    const percentage = parseFloat(rate);
    if (percentage > 75) return 'bg-green-50';
    if (percentage > 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  // Helper function to get consistent colors for hierarchy levels - same colors for same levels regardless of domestic/international
  const getLevelColors = (level: string, isDomestic?: boolean) => {
    switch (level) {
      case 'section':
        return {
          bg: isDomestic ? 'bg-green-50 hover:bg-green-100' : 'bg-blue-50 hover:bg-blue-100',
          text: 'text-gray-900 font-semibold',
          indicator: isDomestic ? 'bg-brand-green' : 'bg-brand-blue'
        };
      case 'continent':
        return {
          bg: 'bg-blue-25 hover:bg-blue-50',
          text: 'text-blue-800 font-semibold',
          indicator: 'bg-blue-600'
        };
      case 'region':
        return {
          bg: 'bg-purple-25 hover:bg-purple-50',
          text: 'text-purple-700 font-semibold', 
          indicator: 'bg-purple-600'
        };
      case 'area':
        return {
          bg: 'hover:bg-gray-50',
          text: 'text-gray-700 font-medium',
          indicator: 'bg-gray-500'
        };
      case 'tour':
        return {
          bg: 'hover:bg-gray-50',
          text: 'text-gray-600',
          indicator: 'bg-gray-400'
        };
      default:
        return {
          bg: 'hover:bg-gray-50',
          text: 'text-gray-600',
          indicator: 'bg-gray-300'
        };
    }
  };

  // Helper function to get text color for data values based on hierarchy level - consistent across domestic/international
  const getDataTextColor = (level: string, isNumeric: boolean = false) => {
    switch (level) {
      case 'section':
        return isNumeric ? 'font-semibold text-gray-900' : 'font-semibold text-gray-900';
      case 'continent':
        return isNumeric ? 'font-semibold text-blue-800' : 'font-semibold text-blue-800';
      case 'region': 
        return isNumeric ? 'font-semibold text-purple-700' : 'font-semibold text-purple-700';
      case 'area':
        return isNumeric ? 'font-medium text-gray-700' : 'font-medium text-gray-700';
      case 'tour':
        return 'text-gray-600';
      default:
        return 'text-gray-500';
    }
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value) / 1000000000;
    return `${num.toFixed(1)}B`;
  };

  // Calculate total daily revenue for hierarchical levels
  const calculateDailyRevenueForLevel = (levelCode: string, level: string, category: string) => {
    let totalDailyRevenue = 0;
    
    if (level === 'region' || level === 'geo_region') {
      // Sum daily revenue from all areas under this region
      const regionAreas = category === 'domestic' 
        ? hierarchyLevels.filter(l => l.level === 'area' && l.parentCode === levelCode)
        : hierarchyLevels.filter(l => l.level === 'area' && l.parentCode === levelCode);
      
      regionAreas.forEach(area => {
        const areaTours = filteredTours.filter(tour => tour.area === area.code);
        areaTours.forEach(tour => {
          totalDailyRevenue += parseFloat(tour.dailyRevenue || "0");
        });
      });
    } else if (level === 'continent') {
      // Sum daily revenue from all regions under this continent
      const continentRegions = hierarchyLevels.filter(l => l.level === 'region' && l.parentCode === levelCode);
      continentRegions.forEach(region => {
        const regionAreas = hierarchyLevels.filter(l => l.level === 'area' && l.parentCode === region.code);
        regionAreas.forEach(area => {
          const areaTours = filteredTours.filter(tour => tour.area === area.code);
          areaTours.forEach(tour => {
            totalDailyRevenue += parseFloat(tour.dailyRevenue || "0");
          });
        });
      });
    } else if (level === 'area') {
      // Sum daily revenue from all tours in this area
      const areaTours = filteredTours.filter(tour => tour.area === levelCode);
      areaTours.forEach(tour => {
        totalDailyRevenue += parseFloat(tour.dailyRevenue || "0");
      });
    }
    
    return totalDailyRevenue.toString();
  };

  // Calculate total daily revenue for sections (domestic/international)
  const calculateSectionDailyRevenue = (category: string) => {
    const categoryTours = filteredTours.filter(tour => tour.category === category);
    const totalDailyRevenue = categoryTours.reduce((sum, tour) => {
      return sum + parseFloat(tour.dailyRevenue || "0");
    }, 0);
    return totalDailyRevenue.toString();
  };

  const calculateSectionPlannedRevenue = (category: string) => {
    const categoryTours = filteredTours.filter(tour => tour.category === category);
    const totalPlannedRevenue = categoryTours.reduce((sum, tour) => {
      return sum + parseFloat(tour.plannedRevenue || "0");
    }, 0);
    return totalPlannedRevenue.toString();
  };

  const getSalesUnitName = (code: string) => {
    const unit = salesUnits.find(u => u.code === code);
    return unit ? unit.name : code;
  };

  // Helper function to render cell content based on column type and data
  const renderCellContent = (columnId: string, rowData: any, rowType: string, isDomestic?: boolean) => {
    const isSection = rowType === 'section';
    const isContinent = rowType === 'continent';
    const isRegion = rowType === 'region';
    const isArea = rowType === 'area';
    const isTour = rowType === 'tour';

    switch (columnId) {
      case 'tourName':
        if (isSection) {
          return (
            <div className="flex items-center">
              {rowData.isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400 mr-2" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400 mr-2" />
              )}
              <div className="flex items-center">
                <div className={`w-2 h-2 ${isDomestic ? 'bg-brand-green' : 'bg-brand-blue'} rounded-full mr-2`}></div>
                <span className="font-semibold text-gray-900 text-sm">
                  {isDomestic ? `TOUR ${rowData.data.name.toUpperCase()}` : 'TOUR QUỐC TẾ'}
                </span>
              </div>
            </div>
          );
        } else if (isContinent) {
          return (
            <div className="flex items-center pl-4">
              {rowData.isExpanded ? (
                <ChevronDown className="w-3 h-3 text-blue-600 mr-2" />
              ) : (
                <ChevronRight className="w-3 h-3 text-blue-400 mr-2" />
              )}
              <span className="font-semibold text-blue-800 text-sm">{rowData.data.name}</span>
            </div>
          );
        } else if (isRegion) {
          return (
            <div className="flex items-center pl-8">
              {rowData.isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-600 mr-2" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-400 mr-2" />
              )}
              <span className="font-semibold text-gray-800 text-sm">{rowData.data.name}</span>
            </div>
          );
        } else if (isArea) {
          const isInternational = rowData.data.category === 'international';
          return (
            <div className="flex items-center pl-12">
              {!isInternational && (
                rowData.isExpanded ? (
                  <ChevronDown className="w-3 h-3 text-gray-500 mr-2" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-gray-300 mr-2" />
                )
              )}
              {isInternational && <div className="w-3 h-3 mr-2"></div>}
              <span className="font-medium text-gray-700 text-sm">{rowData.data.name}</span>
            </div>
          );
        } else if (isTour) {
          return (
            <div className="flex items-center pl-20">
              {rowData.data.imageUrl && (
                <img 
                  src={rowData.data.imageUrl} 
                  alt={rowData.data.name}
                  className="w-6 h-6 rounded mr-2 object-cover"
                />
              )}
              <span className="text-sm text-gray-600">{rowData.data.name}</span>
            </div>
          );
        }
        break;
        
      case 'planned':
        return (
          <span className={`text-center text-sm ${getDataTextColor(rowType, true)}`}>
            {rowData.data.planned.toLocaleString()}
          </span>
        );
        
      case 'sold':
        return (
          <span className={`text-center text-sm ${getDataTextColor(rowType, true)}`}>
            {rowData.data.sold.toLocaleString()}
          </span>
        );
        
      case 'remaining':
        return (
          <span className={`text-center text-sm font-medium text-brand-amber`}>
            {rowData.data.remaining.toLocaleString()}
          </span>
        );
        
      case 'recentlyBooked':
        if (isSection) {
          return (
            <div className="flex items-center justify-center gap-2">
              <span className={`${isDomestic ? 'bg-brand-green' : 'bg-brand-blue'} text-white px-2 py-1 rounded-full text-xs font-medium blink`}>
                +{rowData.data.recentlyBooked}
              </span>
              <div className="flex flex-col items-center">
                <div className="text-xs text-green-600">
                  <span>▲ +{rowData.data.recentlyBooked30min || 0}</span>
                </div>
                <span className="text-[8px] text-gray-400">30 phút qua</span>
              </div>
            </div>
          );
        } else if (isTour) {
          return (
            <div className="flex items-center justify-center gap-2">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs blink">
                +{rowData.data.recentlyBooked}
              </span>
              <div className="flex flex-col items-center">
                <div className="text-xs text-green-600">
                  <span>▲ +{rowData.data.recentlyBooked30min || 0}</span>
                </div>
                <span className="text-[8px] text-gray-400">30 phút qua</span>
              </div>
            </div>
          );
        } else {
          return (
            <div className="flex items-center justify-center gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                +{rowData.data.recentlyBooked}
              </span>
              <div className="flex flex-col items-center">
                <div className="text-xs text-green-600">
                  <span>▲ +{rowData.data.recentlyBooked30min || 0}</span>
                </div>
                <span className="text-[8px] text-gray-400">30 phút qua</span>
              </div>
            </div>
          );
        }
        
      case 'completionRate':
        const rate = parseFloat(rowData.data.completionRate);
        return (
          <div className="text-center">
            <span className={`text-sm font-semibold ${getCompletionRateColor(rowData.data.completionRate)}`}>
              {rate.toFixed(1)}%
            </span>
          </div>
        );
        
      case 'dailyRevenue':
        if (isSection) {
          return (
            <span className="text-center text-sm font-semibold text-blue-600">
              {formatCurrency(calculateSectionDailyRevenue(rowData.section))}
            </span>
          );
        } else if (isContinent || isRegion || isArea) {
          return (
            <span className={`text-center text-sm ${getDataTextColor(rowData.type, true)} text-blue-600`}>
              {formatCurrency(calculateDailyRevenueForLevel(rowData.data.code, rowData.data.level, rowData.data.category))}
            </span>
          );
        } else if (isTour) {
          return (
            <span className={`text-center text-sm ${getDataTextColor(rowData.type, true)} text-blue-600`}>
              {formatCurrency(rowData.data.dailyRevenue || "0")}
            </span>
          );
        }
        break;
        
      case 'revenue':
        return (
          <span className={`text-center text-sm ${getDataTextColor(rowData.type, true)} text-green-600`}>
            {formatCurrency(rowData.data.revenue)}
          </span>
        );
        
      case 'plannedRevenue':
        if (isSection) {
          return (
            <span className="text-center text-sm font-semibold text-purple-600">
              {formatCurrency(calculateSectionPlannedRevenue(rowData.section))}
            </span>
          );
        } else if (isTour) {
          return (
            <span className={`text-center text-sm ${getDataTextColor(rowData.type, true)} text-purple-600`}>
              {formatCurrency(rowData.data.plannedRevenue || "0")}
            </span>
          );
        } else {
          return (
            <span className={`text-center text-sm ${getDataTextColor(rowData.type, true)} text-purple-600`}>
              {formatCurrency(rowData.data.plannedRevenue)}
            </span>
          );
        }
        
      case 'targetPercentage':
        const completionRate = parseFloat(rowData.data.completionRate);
        return (
          <div className="flex flex-col items-center">
            <span className="text-xs text-green-600 leading-tight">
              +{(completionRate * 0.1).toFixed(1)}%
            </span>
            <span className={`text-sm font-medium ${getCompletionRateColor(rowData.data.completionRate)}`}>
              {completionRate.toFixed(1)}%
            </span>
          </div>
        );
        
      case 'topSalesUnit':
        if (selectedSalesUnit === "all") {
          if (isTour) {
            return (
              <span 
                className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded cursor-pointer hover:bg-blue-200 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSalesUnitClick(rowData.data.topSalesUnit);
                }}
                data-testid={`sales-unit-${rowData.data.topSalesUnit}`}
              >
                {getSalesUnitName(rowData.data.topSalesUnit)}
              </span>
            );
          } else {
            return (
              <div className={`w-${isSection ? '3' : '2'} h-${isSection ? '3' : '2'} bg-brand-green rounded-full mx-auto`}></div>
            );
          }
        }
        return null;
        
      default:
        return null;
    }
  };

  const handleSalesUnitClick = (unitCode: string) => {
    setSelectedSalesUnit(unitCode);
  };

  // Filter tours by selected sales unit
  const filteredTours = selectedSalesUnit === "all" 
    ? tours 
    : tours.filter(tour => tour.topSalesUnit === selectedSalesUnit);

  // Check if any filters are active
  const hasActiveFilters = () => {
    return Object.values(levelFilters).some(level => 
      level.domestic || level.international
    );
  };

  // Determine which sections should be shown based on filters
  const getVisibleSections = () => {
    if (!hasActiveFilters()) {
      return ['domestic', 'international']; // Show all if no filters
    }

    const sections: string[] = [];
    
    // Check if any level has domestic filter active
    const hasDomestic = Object.values(levelFilters).some(level => level.domestic);
    if (hasDomestic) sections.push('domestic');
    
    // Check if any level has international filter active
    const hasInternational = Object.values(levelFilters).some(level => level.international);
    if (hasInternational) sections.push('international');
    
    return sections;
  };

  // Get active filter levels for a category
  const getActiveLevels = (category: 'domestic' | 'international') => {
    const levels: string[] = [];
    if (levelFilters.level1[category]) levels.push('level1');
    if (levelFilters.level2[category]) levels.push('level2'); 
    if (levelFilters.level3[category]) levels.push('level3');
    return levels;
  };

  const showSections = getVisibleSections();

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

  // Create rows data based on filter level - always show main categories first
  const allRows: any[] = [];

  // Helper function to add content based on active filters when expanded
  const addExpandedContent = (category: 'domestic' | 'international') => {
    const activeLevels = getActiveLevels(category);
    const isExpanded = category === 'domestic' ? expandedSections.domestic : expandedSections.international;
    
    if (!isExpanded) return;

    // If no specific filters for this category, show full hierarchy
    if (activeLevels.length === 0 && !hasActiveFilters()) {
      if (category === 'domestic') {
        // Show full domestic hierarchy
        domesticRegions.forEach(region => {
          allRows.push({
            type: 'region',
            data: region,
            isExpanded: expandedRegions[region.code] ?? true
          });

          if (expandedRegions[region.code] !== false) {
            const regionAreas = domesticAreas.filter(area => area.parentCode === region.code);
            regionAreas.forEach(area => {
              allRows.push({
                type: 'area',
                data: area,
                isExpanded: expandedAreas[area.code] ?? true
              });

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
      } else {
        // Show full international hierarchy
        internationalContinents.forEach(continent => {
          allRows.push({
            type: 'continent',
            data: continent,
            isExpanded: expandedContinents[continent.code] ?? true
          });

          if (expandedContinents[continent.code] !== false) {
            const continentRegions = internationalRegions.filter(region => region.parentCode === continent.code);
            
            continentRegions.forEach(region => {
              allRows.push({
                type: 'region',
                data: region,
                isExpanded: expandedRegions[region.code] ?? true
              });

              if (expandedRegions[region.code] !== false) {
                const regionAreas = internationalAreas.filter(area => area.parentCode === region.code);
                regionAreas.forEach(area => {
                  allRows.push({
                    type: 'area',
                    data: area,
                    isExpanded: false
                  });
                });
              }
            });
          }
        });
      }
      return;
    }

    // Build hierarchy showing only selected levels but maintaining parent-child relationships
    if (category === 'domestic') {
      const shouldShowLevel1 = activeLevels.includes('level1');
      const shouldShowLevel2 = activeLevels.includes('level2'); 
      const shouldShowLevel3 = activeLevels.includes('level3');

      if (shouldShowLevel1 && !shouldShowLevel2 && !shouldShowLevel3) {
        // Only Level 1 selected - show regions only
        domesticRegions.forEach(region => {
          allRows.push({
            type: 'region',
            data: region,
            isExpanded: false
          });
        });
      } else if (!shouldShowLevel1 && shouldShowLevel2 && !shouldShowLevel3) {
        // Only Level 2 selected - show areas only
        domesticAreas.forEach(area => {
          allRows.push({
            type: 'area',
            data: area,
            isExpanded: false
          });
        });
      } else if (!shouldShowLevel1 && !shouldShowLevel2 && shouldShowLevel3) {
        // Only Level 3 selected - show tours only
        const domesticTours = filteredTours.filter(tour => tour.category === 'domestic');
        domesticTours.forEach(tour => {
          allRows.push({
            type: 'tour',
            data: tour
          });
        });
      } else if (shouldShowLevel1 && shouldShowLevel2 && !shouldShowLevel3) {
        // Level 1 + 2 selected - show regions with areas inside
        domesticRegions.forEach(region => {
          allRows.push({
            type: 'region',
            data: region,
            isExpanded: true
          });

          const regionAreas = domesticAreas.filter(area => area.parentCode === region.code);
          regionAreas.forEach(area => {
            allRows.push({
              type: 'area',
              data: area,
              isExpanded: false
            });
          });
        });
      } else if (shouldShowLevel1 && !shouldShowLevel2 && shouldShowLevel3) {
        // Level 1 + 3 selected - show regions with tours inside (skip areas)
        domesticRegions.forEach(region => {
          allRows.push({
            type: 'region',
            data: region,
            isExpanded: true
          });

          // Get all tours that belong to areas under this region
          const regionAreas = domesticAreas.filter(area => area.parentCode === region.code);
          regionAreas.forEach(area => {
            const areaTours = toursByArea[area.code] || [];
            areaTours.forEach(tour => {
              allRows.push({
                type: 'tour',
                data: tour
              });
            });
          });
        });
      } else if (!shouldShowLevel1 && shouldShowLevel2 && shouldShowLevel3) {
        // Level 2 + 3 selected - show areas with tours inside (skip regions)
        domesticAreas.forEach(area => {
          allRows.push({
            type: 'area',
            data: area,
            isExpanded: true
          });

          const areaTours = toursByArea[area.code] || [];
          areaTours.forEach(tour => {
            allRows.push({
              type: 'tour',
              data: tour
            });
          });
        });
      } else if (shouldShowLevel1 && shouldShowLevel2 && shouldShowLevel3) {
        // All levels selected - show full hierarchy
        domesticRegions.forEach(region => {
          allRows.push({
            type: 'region',
            data: region,
            isExpanded: true
          });

          const regionAreas = domesticAreas.filter(area => area.parentCode === region.code);
          regionAreas.forEach(area => {
            allRows.push({
              type: 'area',
              data: area,
              isExpanded: true
            });

            const areaTours = toursByArea[area.code] || [];
            areaTours.forEach(tour => {
              allRows.push({
                type: 'tour',
                data: tour
              });
            });
          });
        });
      }
    } else {
      // Similar logic for international tours
      const shouldShowLevel1 = activeLevels.includes('level1');
      const shouldShowLevel2 = activeLevels.includes('level2');
      const shouldShowLevel3 = activeLevels.includes('level3');

      if (shouldShowLevel1 && !shouldShowLevel2 && !shouldShowLevel3) {
        internationalContinents.forEach(continent => {
          allRows.push({
            type: 'continent',
            data: continent,
            isExpanded: false
          });
        });
      } else if (!shouldShowLevel1 && shouldShowLevel2 && !shouldShowLevel3) {
        internationalRegions.forEach(region => {
          allRows.push({
            type: 'region',
            data: region,
            isExpanded: false
          });
        });
      } else if (!shouldShowLevel1 && !shouldShowLevel2 && shouldShowLevel3) {
        // Level 3 international: Show countries (areas) not tours
        internationalAreas.forEach(area => {
          allRows.push({
            type: 'area',
            data: area,
            isExpanded: false
          });
        });
      } else if (shouldShowLevel1 && shouldShowLevel2 && !shouldShowLevel3) {
        internationalContinents.forEach(continent => {
          allRows.push({
            type: 'continent',
            data: continent,
            isExpanded: true
          });

          const continentRegions = internationalRegions.filter(region => region.parentCode === continent.code);
          continentRegions.forEach(region => {
            allRows.push({
              type: 'region',
              data: region,
              isExpanded: false
            });
          });
        });
      } else if (!shouldShowLevel1 && shouldShowLevel2 && shouldShowLevel3) {
        // Level 2 + 3 international: Show regions with countries (areas) inside
        internationalRegions.forEach(region => {
          allRows.push({
            type: 'region',
            data: region,
            isExpanded: true
          });

          const regionAreas = internationalAreas.filter(area => area.parentCode === region.code);
          regionAreas.forEach(area => {
            allRows.push({
              type: 'area',
              data: area,
              isExpanded: false
            });
          });
        });
      } else if (shouldShowLevel1 && shouldShowLevel2 && shouldShowLevel3) {
        internationalContinents.forEach(continent => {
          allRows.push({
            type: 'continent',
            data: continent,
            isExpanded: true
          });

          const continentRegions = internationalRegions.filter(region => region.parentCode === continent.code);
          continentRegions.forEach(region => {
            allRows.push({
              type: 'region',
              data: region,
              isExpanded: true
            });

            const regionAreas = internationalAreas.filter(area => area.parentCode === region.code);
            regionAreas.forEach(area => {
              allRows.push({
                type: 'area',
                data: area,
                isExpanded: false
              });
            });
          });
        });
      }
    }
  };

  // Always add main categories first, then their content when expanded
  if (domesticRoot && showSections.includes('domestic')) {
    allRows.push({
      type: 'section',
      section: 'domestic',
      data: domesticRoot,
      isExpanded: expandedSections.domestic
    });

    // Add content when expanded
    addExpandedContent('domestic');
  }

  if (internationalRoot && showSections.includes('international')) {
    allRows.push({
      type: 'section',
      section: 'international',
      data: internationalRoot,
      isExpanded: expandedSections.international
    });

    // Add content when expanded
    addExpandedContent('international');
  }

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200" data-testid="hierarchical-tour-table">
      <CardHeader className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Bảng Theo Dõi Tour Realtime
          </CardTitle>
          
          <div className="flex items-center space-x-4">
            {/* Column Customizer */}
            <ColumnCustomizer 
              columns={columns}
              onColumnsChange={setColumns}
            />
            
            {/* Level Filter */}
            <LevelFilter 
              filters={levelFilters} 
              onChange={setLevelFilters} 
            />
            
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
        </div>
      </CardHeader>
      
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full table-responsive">
          <thead className="bg-gray-50">
            <tr>
              {columns
                .filter(col => col.visible && (col.id !== 'topSalesUnit' || selectedSalesUnit === "all"))
                .map(column => (
                  <th 
                    key={column.id}
                    className={`px-2 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.id === 'tourName' ? 'text-left px-3' : 'text-center'
                    }`}
                    style={{ width: column.width }}
                  >
                    {column.label}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allRows.map((row, index) => {
              const isDomestic = row.section === 'domestic';
              const levelColors = getLevelColors(row.type, isDomestic);
              
              const getRowClassName = () => {
                let baseClass = `table-row-hover ${levelColors.bg}`;
                
                if (row.type === 'section') {
                  return `${baseClass} cursor-pointer`;
                } else if (row.type === 'continent') {
                  return `${baseClass} cursor-pointer`;
                } else if (row.type === 'region') {
                  return `${baseClass} cursor-pointer`;
                } else if (row.type === 'area') {
                  const isInternational = row.data.category === 'international';
                  return `${baseClass} ${!isInternational ? 'cursor-pointer' : ''}`;
                } else if (row.type === 'tour') {
                  return baseClass;
                }
                return baseClass;
              };

              const getOnClick = () => {
                if (row.type === 'section') {
                  return () => toggleSection(row.section);
                } else if (row.type === 'continent') {
                  return () => toggleContinent(row.data.code);
                } else if (row.type === 'region') {
                  return () => toggleRegion(row.data.code);
                } else if (row.type === 'area' && row.data.category !== 'international') {
                  return () => toggleArea(row.data.code);
                }
                return undefined;
              };

              const getTestId = () => {
                if (row.type === 'section') {
                  return `section-${row.section}`;
                } else if (row.type === 'continent') {
                  return `continent-${row.data.code}`;
                } else if (row.type === 'region') {
                  return `region-${row.data.code}`;
                } else if (row.type === 'area') {
                  return `area-${row.data.code}`;
                } else if (row.type === 'tour') {
                  return `tour-${row.data.id}`;
                }
                return undefined;
              };

              return (
                <tr 
                  key={`${row.type}-${row.section || row.data?.id || row.data?.code || index}`}
                  className={getRowClassName()}
                  onClick={getOnClick()}
                  data-testid={getTestId()}
                >
                  {columns
                    .filter(col => col.visible && (col.id !== 'topSalesUnit' || selectedSalesUnit === "all"))
                    .map(column => (
                      <td 
                        key={column.id}
                        className={`px-2 py-2 ${
                          column.id === 'tourName' ? 'px-3 py-3 whitespace-nowrap' : 'text-center'
                        } ${
                          row.type === 'section' ? 'py-3' : 'py-2'
                        }`}
                      >
                        {renderCellContent(column.id, row, row.type, isDomestic)}
                      </td>
                    ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
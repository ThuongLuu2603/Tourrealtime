import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

export interface LevelFilters {
  level1: {
    domestic: boolean;
    international: boolean;
  };
  level2: {
    domestic: boolean;
    international: boolean;
  };
  level3: {
    domestic: boolean;
    international: boolean;
  };
}

interface LevelFilterProps {
  filters: LevelFilters;
  onChange: (filters: LevelFilters) => void;
}

export const LevelFilter: React.FC<LevelFilterProps> = ({ filters, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const updateFilter = (level: keyof LevelFilters, category: 'domestic' | 'international', checked: boolean) => {
    onChange({
      ...filters,
      [level]: {
        ...filters[level],
        [category]: checked
      }
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    Object.values(filters).forEach(level => {
      if (level.domestic) count++;
      if (level.international) count++;
    });
    return count;
  };

  const activeCount = getActiveFiltersCount();

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
          <span className="text-sm font-medium text-gray-700">
            Lọc theo cấp {activeCount > 0 && `(${activeCount})`}
          </span>
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="absolute z-50 mt-2">
        <Card className="w-80 shadow-lg border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Chọn cấp hiển thị</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Level 1 */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Level 1 - Vùng miền</h4>
              <div className="space-y-2 pl-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="level1-domestic"
                    checked={filters.level1.domestic}
                    onCheckedChange={(checked) => updateFilter('level1', 'domestic', checked as boolean)}
                  />
                  <label htmlFor="level1-domestic" className="text-sm text-gray-700 cursor-pointer">
                    Nội địa
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="level1-international"
                    checked={filters.level1.international}
                    onCheckedChange={(checked) => updateFilter('level1', 'international', checked as boolean)}
                  />
                  <label htmlFor="level1-international" className="text-sm text-gray-700 cursor-pointer">
                    Quốc tế
                  </label>
                </div>
              </div>
            </div>

            {/* Level 2 */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Level 2 - Khu vực</h4>
              <div className="space-y-2 pl-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="level2-domestic"
                    checked={filters.level2.domestic}
                    onCheckedChange={(checked) => updateFilter('level2', 'domestic', checked as boolean)}
                  />
                  <label htmlFor="level2-domestic" className="text-sm text-gray-700 cursor-pointer">
                    Nội địa
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="level2-international"
                    checked={filters.level2.international}
                    onCheckedChange={(checked) => updateFilter('level2', 'international', checked as boolean)}
                  />
                  <label htmlFor="level2-international" className="text-sm text-gray-700 cursor-pointer">
                    Quốc tế
                  </label>
                </div>
              </div>
            </div>

            {/* Level 3 */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Level 3 - Tuyến tour</h4>
              <div className="space-y-2 pl-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="level3-domestic"
                    checked={filters.level3.domestic}
                    onCheckedChange={(checked) => updateFilter('level3', 'domestic', checked as boolean)}
                  />
                  <label htmlFor="level3-domestic" className="text-sm text-gray-700 cursor-pointer">
                    Nội địa
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="level3-international"
                    checked={filters.level3.international}
                    onCheckedChange={(checked) => updateFilter('level3', 'international', checked as boolean)}
                  />
                  <label htmlFor="level3-international" className="text-sm text-gray-700 cursor-pointer">
                    Quốc tế
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};
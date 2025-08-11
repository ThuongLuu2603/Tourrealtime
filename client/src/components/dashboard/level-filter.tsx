import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type FilterLevel = 'all' | 'level1_domestic' | 'level1_international' | 'level2_domestic' | 'level2_international' | 'level3_domestic' | 'level3_international';

interface LevelFilterProps {
  value: FilterLevel;
  onChange: (value: FilterLevel) => void;
}

export const LevelFilter: React.FC<LevelFilterProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Lọc theo cấp:</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Chọn cấp hiển thị" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50">
            Vùng Miền (Level 1)
          </div>
          <SelectItem value="level1_domestic">Level 1 - Nội địa (Miền Bắc, Miền Trung, Miền Nam)</SelectItem>
          <SelectItem value="level1_international">Level 1 - Quốc tế (Châu Á, Châu Âu, Châu Úc)</SelectItem>
          
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50">
            Khu vực (Level 2)
          </div>
          <SelectItem value="level2_domestic">Level 2 - Nội địa (Tây Bắc, Đông Bắc, Tây Nguyên)</SelectItem>
          <SelectItem value="level2_international">Level 2 - Quốc tế (Đông Bắc Á, Đông Nam Á, Tây Âu)</SelectItem>
          
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50">
            Tuyến tour (Level 3)
          </div>
          <SelectItem value="level3_domestic">Level 3 - Nội địa (Hạ Long - Sapa, Đà Nẵng - Hội An)</SelectItem>
          <SelectItem value="level3_international">Level 3 - Quốc tế (Trung Quốc, Nhật Bản, Hàn Quốc)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
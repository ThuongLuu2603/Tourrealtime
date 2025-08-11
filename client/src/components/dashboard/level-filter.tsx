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
            Vùng miền (Level 1)
          </div>
          <SelectItem value="level1_domestic">Nội địa - Vùng miền (Miền Bắc, Miền Trung, Miền Nam)</SelectItem>
          <SelectItem value="level1_international">Quốc tế - Vùng miền (Châu Á, Châu Âu)</SelectItem>
          
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50">
            Khu vực (Level 2)
          </div>
          <SelectItem value="level2_domestic">Nội địa - Khu vực (ĐBSH&DH, Tây Bắc, Duyên Hải)</SelectItem>
          <SelectItem value="level2_international">Quốc tế - Khu vực (Đông Bắc Á, Đông Nam Á, Nam Á)</SelectItem>
          
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50">
            Tuyến tour (Level 3)
          </div>
          <SelectItem value="level3_domestic">Nội địa - Tuyến tour (Hạ Long - Sapa, Phú Quốc)</SelectItem>
          <SelectItem value="level3_international">Quốc tế - Tuyến tour (Trung Quốc, Nhật Bản, Hàn Quốc)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type FilterLevel = 'all' | 'level1' | 'level2' | 'level3';

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
          <SelectItem value="all">Tất cả cấp độ</SelectItem>
          <SelectItem value="level1">Level 1 - Vùng miền</SelectItem>
          <SelectItem value="level2">Level 2 - Khu vực</SelectItem>
          <SelectItem value="level3">Level 3 - Tuyến tour</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
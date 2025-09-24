import { useState, useEffect } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DayPicker, DateRange } from "react-day-picker";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import "react-day-picker/dist/style.css";

type FilterType = 'week' | 'month' | 'year' | 'day' | 'custom';

interface DateFilterDropdownProps {
  onSelectionChange?: (type: FilterType, values: number[], dates?: { selectedDay?: Date; dateRange?: { from: Date; to?: Date } }) => void;
}

export default function DateFilterDropdown({ onSelectionChange }: DateFilterDropdownProps) {
  const [selectedType, setSelectedType] = useState<FilterType>('week');
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date } | undefined>();
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showRangePicker, setShowRangePicker] = useState(false);

  // Calculate current week number from current date
  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.ceil(diff / oneWeek);
  };

  // Calculate current month
  const getCurrentMonth = () => {
    return new Date().getMonth() + 1; // getMonth() returns 0-11
  };

  // Initialize with current week based on server date
  useEffect(() => {
    const currentWeek = getCurrentWeek();
    setSelectedWeeks([currentWeek]);
    onSelectionChange?.('week', [currentWeek]);
  }, []);

  const handleWeekSelection = (week: number) => {
    const newSelectedWeeks = selectedWeeks.includes(week)
      ? selectedWeeks.filter(w => w !== week)
      : [...selectedWeeks, week].sort((a, b) => a - b);
    
    setSelectedWeeks(newSelectedWeeks);
    setSelectedType('week');
    onSelectionChange?.('week', newSelectedWeeks);
  };

  const handleMonthSelection = (month: number) => {
    const newSelectedMonths = selectedMonths.includes(month)
      ? selectedMonths.filter(m => m !== month)
      : [...selectedMonths, month].sort((a, b) => a - b);
    
    setSelectedMonths(newSelectedMonths);
    setSelectedType('month');
    onSelectionChange?.('month', newSelectedMonths);
  };

  const handleYearSelection = () => {
    setSelectedType('year');
    onSelectionChange?.('year', []);
  };

  const handleDaySelection = (day: Date | undefined) => {
    setSelectedDay(day);
    setSelectedType('day');
    setShowDayPicker(false);
    if (day) {
      onSelectionChange?.('day', [], { selectedDay: day });
    }
  };

  const handleRangeSelection = (range: DateRange | undefined) => {
    if (range && range.from) {
      const validRange = { from: range.from, to: range.to };
      setDateRange(validRange);
      setSelectedType('custom');
      onSelectionChange?.('custom', [], { dateRange: validRange });
      if (range.to) {
        setShowRangePicker(false);
      }
    } else {
      setDateRange(undefined);
    }
  };

  const getDisplayText = () => {
    if (selectedType === 'week') {
      if (selectedWeeks.length === 0) return 'Chọn Kế hoạch tuần';
      if (selectedWeeks.length === 1) return `Kế hoạch Tuần ${selectedWeeks[0]}`;
      return `${selectedWeeks.length} Kế hoạch tuần đã chọn`;
    } else if (selectedType === 'month') {
      if (selectedMonths.length === 0) return 'Chọn Kế hoạch tháng';
      if (selectedMonths.length === 1) return `Kế hoạch Tháng ${selectedMonths[0]}`;
      return `${selectedMonths.length} kế hoạch tháng đã chọn`;
    } else if (selectedType === 'day') {
      return selectedDay ? `Kế hoạch Ngày ${format(selectedDay, 'dd/MM/yyyy', { locale: vi })}` : 'Chọn Kế hoạch ngày';
    } else if (selectedType === 'custom') {
      if (dateRange?.from) {
        const fromStr = format(dateRange.from, 'dd/MM/yyyy', { locale: vi });
        const toStr = dateRange.to ? format(dateRange.to, 'dd/MM/yyyy', { locale: vi }) : '';
        return dateRange.to ? `${fromStr} - ${toStr}` : `Từ ${fromStr}`;
      }
      return 'Chọn khoảng thời gian';
    } else {
      return `Kế hoạch cả năm`;
    }
  };

  // Generate week options (1-52)
  const weekOptions = Array.from({ length: 52 }, (_, i) => i + 1);
  
  // Generate month options (1-12)
  const monthOptions = [
    { value: 1, label: 'Tháng 1' },
    { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' },
    { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' },
    { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' },
    { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' },
    { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' },
    { value: 12, label: 'Tháng 12' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="min-w-[140px] justify-between"
          data-testid="date-filter-dropdown"
        >
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {getDisplayText()}
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end">
        {/* Day Selection */}
        <DropdownMenuSub open={showDayPicker} onOpenChange={setShowDayPicker}>
          <DropdownMenuSubTrigger className="flex items-center">
            <span className="text-pink-500 mr-2">●</span>
            Kế hoạch Ngày
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-auto p-3">
            <DayPicker
              mode="single"
              selected={selectedDay}
              onSelect={handleDaySelection}
              locale={vi}
              className="rdp-small"
            />
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Week Selection */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center">
            <span className="text-pink-500 mr-2">●</span>
            Kế hoạch Tuần
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="max-h-64 overflow-y-auto">
            {weekOptions.map((week) => (
              <DropdownMenuItem
                key={week}
                onClick={(e) => {
                  e.preventDefault();
                  handleWeekSelection(week);
                }}
                className="cursor-pointer flex items-center justify-between"
                data-testid={`week-${week}`}
              >
                <span>Kế hoạch Tuần {week}</span>
                <div className="flex items-center">
                  {getCurrentWeek() === week && (
                    <span className="text-xs text-green-600 mr-2">(Hiện tại)</span>
                  )}
                  {selectedWeeks.includes(week) && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Month Selection */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center">
            <span className="text-pink-500 mr-2">●</span>
            Kế hoạch Tháng
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {monthOptions.map((month) => (
              <DropdownMenuItem
                key={month.value}
                onClick={(e) => {
                  e.preventDefault();
                  handleMonthSelection(month.value);
                }}
                className="cursor-pointer flex items-center justify-between"
                data-testid={`month-${month.value}`}
              >
                <span>{month.label}</span>
                <div className="flex items-center">
                  {getCurrentMonth() === month.value && (
                    <span className="text-xs text-green-600 mr-2">(Hiện tại)</span>
                  )}
                  {selectedMonths.includes(month.value) && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Year Selection */}
        <DropdownMenuItem
          onClick={handleYearSelection}
          className={`cursor-pointer flex items-center justify-between ${
            selectedType === 'year' 
              ? 'bg-blue-50 text-blue-600' 
              : ''
          }`}
          data-testid="year-option"
        >
          <div className="flex items-center">
            <span className="text-pink-500 mr-2">●</span>
            <span>Kế hoạch cả năm</span>
          </div>
          {selectedType === 'year' && (
            <Check className="w-4 h-4 text-blue-600" />
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Custom Range Selection */}
        <DropdownMenuSub open={showRangePicker} onOpenChange={setShowRangePicker}>
          <DropdownMenuSubTrigger className="flex items-center">
            <span className="text-pink-500 mr-2">●</span>
            Chọn trên Calendar
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-auto p-3">
            <DayPicker
              mode="range"
              selected={dateRange}
              onSelect={handleRangeSelection}
              locale={vi}
              className="rdp-small"
            />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
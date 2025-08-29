import { useState, useEffect } from "react";
import { Calendar, ChevronDown } from "lucide-react";
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

type FilterType = 'week' | 'month';

interface DateFilterDropdownProps {
  onSelectionChange?: (type: FilterType, value: number) => void;
}

export default function DateFilterDropdown({ onSelectionChange }: DateFilterDropdownProps) {
  const [selectedType, setSelectedType] = useState<FilterType>('week');
  const [selectedValue, setSelectedValue] = useState<number>(1);

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

  // Initialize with current week/month based on server date
  useEffect(() => {
    const currentWeek = getCurrentWeek();
    setSelectedValue(currentWeek);
    onSelectionChange?.('week', currentWeek);
  }, []);

  const handleSelection = (type: FilterType, value: number) => {
    setSelectedType(type);
    setSelectedValue(value);
    onSelectionChange?.(type, value);
  };

  const getDisplayText = () => {
    if (selectedType === 'week') {
      return `Tuần ${selectedValue}`;
    } else {
      return `Tháng ${selectedValue}`;
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
        {/* Week Selection */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center">
            <span className="text-pink-500 mr-2">●</span>
            Tuần
            <ChevronDown className="w-4 h-4 ml-auto" />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="max-h-64 overflow-y-auto">
            {weekOptions.map((week) => (
              <DropdownMenuItem
                key={week}
                onClick={() => handleSelection('week', week)}
                className={`cursor-pointer ${
                  selectedType === 'week' && selectedValue === week 
                    ? 'bg-blue-50 text-blue-600' 
                    : ''
                }`}
                data-testid={`week-${week}`}
              >
                Tuần {week}
                {getCurrentWeek() === week && (
                  <span className="ml-auto text-xs text-green-600">(Hiện tại)</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Month Selection */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center">
            <span className="text-pink-500 mr-2">●</span>
            Tháng
            <ChevronDown className="w-4 h-4 ml-auto" />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {monthOptions.map((month) => (
              <DropdownMenuItem
                key={month.value}
                onClick={() => handleSelection('month', month.value)}
                className={`cursor-pointer ${
                  selectedType === 'month' && selectedValue === month.value 
                    ? 'bg-blue-50 text-blue-600' 
                    : ''
                }`}
                data-testid={`month-${month.value}`}
              >
                {month.label}
                {getCurrentMonth() === month.value && (
                  <span className="ml-auto text-xs text-green-600">(Hiện tại)</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
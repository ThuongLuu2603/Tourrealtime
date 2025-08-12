import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Settings, Eye, EyeOff, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  width?: string;
  fixed?: boolean; // Cột không thể ẩn
}

interface ColumnCustomizerProps {
  columns: ColumnConfig[];
  onColumnsChange: (columns: ColumnConfig[]) => void;
  className?: string;
}

export default function ColumnCustomizer({ columns, onColumnsChange, className }: ColumnCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleVisibilityChange = (columnId: string, visible: boolean) => {
    const updatedColumns = columns.map(col => 
      col.id === columnId ? { ...col, visible } : col
    );
    onColumnsChange(updatedColumns);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const updatedColumns = [...columns];
      const [draggedColumn] = updatedColumns.splice(draggedIndex, 1);
      updatedColumns.splice(dragOverIndex, 0, draggedColumn);
      onColumnsChange(updatedColumns);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const visibleColumns = columns.filter(col => col.visible);
  const hiddenColumns = columns.filter(col => !col.visible);

  const resetToDefault = () => {
    const defaultColumns = columns.map(col => ({
      ...col,
      visible: !['revenue', 'plannedRevenue'].includes(col.id)
    }));
    onColumnsChange(defaultColumns);
  };

  const showAll = () => {
    const allVisibleColumns = columns.map(col => ({
      ...col,
      visible: true
    }));
    onColumnsChange(allVisibleColumns);
  };

  const hideAll = () => {
    const allHiddenColumns = columns.map(col => ({
      ...col,
      visible: col.fixed || false // Chỉ giữ lại các cột bắt buộc
    }));
    onColumnsChange(allHiddenColumns);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={cn("flex items-center gap-2", className)}
        >
          <Settings className="w-4 h-4" />
          Tùy chỉnh cột
          <Badge variant="secondary" className="ml-1">
            {visibleColumns.length}/{columns.length}
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Tùy chỉnh cột hiển thị
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={resetToDefault}>
              Mặc định
            </Button>
            <Button variant="outline" size="sm" onClick={showAll}>
              Hiện tất cả
            </Button>
            <Button variant="outline" size="sm" onClick={hideAll}>
              Ẩn tất cả
            </Button>
          </div>

          {/* Column Statistics */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{visibleColumns.length}</div>
              <div className="text-sm text-gray-600">Cột hiển thị</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">{hiddenColumns.length}</div>
              <div className="text-sm text-gray-600">Cột ẩn</div>
            </div>
          </div>

          {/* Drag and Drop Column List */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 mb-3">Sắp xếp và hiển thị cột</h4>
            <div className="space-y-1">
              {columns.map((column, index) => (
                <div
                  key={column.id}
                  draggable={!column.fixed}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-all",
                    column.visible 
                      ? "bg-white border-gray-200 shadow-sm" 
                      : "bg-gray-50 border-gray-200 opacity-60",
                    draggedIndex === index && "opacity-50",
                    dragOverIndex === index && "border-blue-300 bg-blue-50",
                    !column.fixed && "cursor-move hover:shadow-md"
                  )}
                >
                  {/* Drag Handle */}
                  {!column.fixed && (
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  )}
                  {column.fixed && (
                    <div className="w-4 h-4" /> 
                  )}
                  
                  {/* Visibility Toggle */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={column.visible}
                      onCheckedChange={(checked) => 
                        !column.fixed && handleVisibilityChange(column.id, checked as boolean)
                      }
                      disabled={column.fixed}
                    />
                    {column.visible ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </div>

                  {/* Column Label */}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{column.label}</div>
                    {column.fixed && (
                      <div className="text-xs text-gray-500 mt-1">Cột bắt buộc</div>
                    )}
                  </div>

                  {/* Column Width Badge */}
                  {column.width && (
                    <Badge variant="outline" className="text-xs">
                      {column.width}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Hidden Columns Summary */}
          {hiddenColumns.length > 0 && (
            <div className="p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <EyeOff className="w-4 h-4 text-amber-600" />
                <span className="font-medium text-amber-800">Cột đang ẩn ({hiddenColumns.length})</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {hiddenColumns.map(col => (
                  <Badge key={col.id} variant="secondary" className="text-xs">
                    {col.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Hủy
            </Button>
            <Button onClick={() => setIsOpen(false)}>
              Áp dụng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
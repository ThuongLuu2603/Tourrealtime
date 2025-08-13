import { type Tour, type HierarchyLevel, type SalesUnit, type Activity, type RegionalPerformance, type InsertTour, type InsertHierarchyLevel, type InsertSalesUnit, type InsertActivity, type InsertRegionalPerformance, type DashboardMetrics } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Tours
  getTours(): Promise<Tour[]>;
  getToursByCategory(category: string): Promise<Tour[]>;
  getToursByArea(areaCode: string): Promise<Tour[]>;
  getToursBySalesUnit(salesUnitCode: string): Promise<Tour[]>;
  createTour(tour: InsertTour): Promise<Tour>;
  updateTour(id: string, tour: Partial<Tour>): Promise<Tour | undefined>;
  
  // Hierarchy Levels
  getHierarchyLevels(): Promise<HierarchyLevel[]>;
  getHierarchyLevelsByCategory(category: string): Promise<HierarchyLevel[]>;
  getHierarchyLevelsByLevel(level: string): Promise<HierarchyLevel[]>;
  createHierarchyLevel(level: InsertHierarchyLevel): Promise<HierarchyLevel>;
  updateHierarchyLevel(id: string, level: Partial<HierarchyLevel>): Promise<HierarchyLevel | undefined>;
  
  // Sales Units
  getSalesUnits(): Promise<SalesUnit[]>;
  createSalesUnit(unit: InsertSalesUnit): Promise<SalesUnit>;
  updateSalesUnit(id: string, unit: Partial<SalesUnit>): Promise<SalesUnit | undefined>;
  
  // Activities
  getRecentActivities(limit: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Regional Performance
  getRegionalPerformance(): Promise<RegionalPerformance[]>;
  createRegionalPerformance(performance: InsertRegionalPerformance): Promise<RegionalPerformance>;
  
  // Dashboard Metrics
  getDashboardMetrics(): Promise<DashboardMetrics>;
}

export class MemStorage implements IStorage {
  private tours: Map<string, Tour>;
  private hierarchyLevels: Map<string, HierarchyLevel>;
  private salesUnits: Map<string, SalesUnit>;
  private activities: Map<string, Activity>;
  private regionalPerformance: Map<string, RegionalPerformance>;

  constructor() {
    this.tours = new Map();
    this.hierarchyLevels = new Map();
    this.salesUnits = new Map();
    this.activities = new Map();
    this.regionalPerformance = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize Sales Units
    const salesUnitsData: InsertSalesUnit[] = [
      { name: "TP. Hồ Chí Minh", code: "HCM", performanceRate: "85.2", status: "good" },
      { name: "Hà Nội", code: "HN", performanceRate: "78.9", status: "good" },
      { name: "Cần Thơ", code: "CT", performanceRate: "72.4", status: "moderate" },
    ];

    salesUnitsData.forEach(unitData => {
      const unit: SalesUnit = { 
        id: randomUUID(),
        name: unitData.name,
        code: unitData.code,
        performanceRate: unitData.performanceRate || "0",
        status: unitData.status || "good"
      };
      this.salesUnits.set(unit.id, unit);
    });

    // Initialize Hierarchy Levels
    const hierarchyData: InsertHierarchyLevel[] = [
      // International - Level 1: Tour Quốc tế - Tổng 30min = 8+10+2+1 = 21 
      { name: "TOUR QUỐC TẾ", code: "tour_quoc_te", category: "international", level: "tour_category", parentCode: null, planned: 18935, sold: 14267, remaining: 4668, recentlyBooked: 37,
        recentlyBooked30min: 21, completionRate: "75.3", revenue: "789480000000", plannedRevenue: "950000000000", targetPercentage: "12.4" },
      
      // International - Level 2: Châu lục - Châu Á 30min = 8+10+2 = 20, Châu Âu = 1  
      { name: "Châu Á", code: "chau_a", category: "international", level: "continent", parentCode: "tour_quoc_te", planned: 18935, sold: 14267, remaining: 4668, recentlyBooked: 37,
        recentlyBooked30min: 20, completionRate: "75.3", revenue: "789480000000", plannedRevenue: "850000000000", targetPercentage: "12.4" },
      { name: "Châu Âu", code: "chau_au", category: "international", level: "continent", parentCode: "tour_quoc_te", planned: 2401, sold: 1550, remaining: 851, recentlyBooked: 3,
        recentlyBooked30min: 1, completionRate: "64.5", revenue: "245000000000", plannedRevenue: "300000000000", targetPercentage: "8.5" },
      
      // International - Level 3: Khu vực - 30min: Đông Bắc Á = 2+2+2+2 = 8, Đông Nam Á = 2+2+2+2+2 = 10, Nam Á = 2
      { name: "Đông Bắc Á", code: "dong_bac_a", category: "international", level: "region", parentCode: "chau_a", planned: 8753, sold: 6592, remaining: 2161, recentlyBooked: 22,
        recentlyBooked30min: 8, completionRate: "75.3", revenue: "464936000000", plannedRevenue: "520000000000", targetPercentage: "10.7" },
      { name: "Đông Nam Á", code: "dong_nam_a", category: "international", level: "region", parentCode: "chau_a", planned: 7781, sold: 5550, remaining: 2231, recentlyBooked: 13,
        recentlyBooked30min: 10, completionRate: "71.3", revenue: "275065000000", plannedRevenue: "320000000000", targetPercentage: "11.2" },
      { name: "Nam Á", code: "nam_a", category: "international", level: "region", parentCode: "chau_a", planned: 2401, sold: 2125, remaining: 276, recentlyBooked: 2,
        recentlyBooked30min: 2, completionRate: "88.5", revenue: "49479000000", plannedRevenue: "60000000000", targetPercentage: "14.2" },
      
      // International - Level 4: Tuyến Tour cụ thể (quốc gia)
      // Đông Bắc Á (8.753) = Trung Quốc (3.200) + Nhật Bản (2.156) + Hàn Quốc (2.800) + Mongolia (597)
      { name: "Trung Quốc", code: "trung_quoc", category: "international", level: "area", parentCode: "dong_bac_a", planned: 3200, sold: 2400, remaining: 800, recentlyBooked: 4,
        recentlyBooked30min: 2, completionRate: "75.0", revenue: "180000000000", plannedRevenue: "210000000000", targetPercentage: "9.5" },
      { name: "Nhật Bản", code: "nhat_ban", category: "international", level: "area", parentCode: "dong_bac_a", planned: 2156, sold: 1987, remaining: 169, recentlyBooked: 10,
        recentlyBooked30min: 2, completionRate: "92.2", revenue: "287350000000", plannedRevenue: "320000000000", targetPercentage: "15.2" },
      { name: "Hàn Quốc", code: "han_quoc", category: "international", level: "area", parentCode: "dong_bac_a", planned: 2800, sold: 2100, remaining: 700, recentlyBooked: 7,
        recentlyBooked30min: 2, completionRate: "75.0", revenue: "165000000000", plannedRevenue: "190000000000", targetPercentage: "8.2" },
      { name: "Mongolia", code: "mongolia", category: "international", level: "area", parentCode: "dong_bac_a", planned: 597, sold: 105, remaining: 492, recentlyBooked: 1,
        recentlyBooked30min: 2, completionRate: "17.6", revenue: "12286000000", plannedRevenue: "25000000000", targetPercentage: "2.8" },
      // Đông Nam Á (7.781) = Thái Lan (2.800) + Singapore-Malaysia (1.987) + Lào (800) + Campuchia (700) + Indonesia (1.494)
      { name: "Thái Lan", code: "thai_lan", category: "international", level: "area", parentCode: "dong_nam_a", planned: 2800, sold: 2200, remaining: 600, recentlyBooked: 3,
        recentlyBooked30min: 2, completionRate: "78.6", revenue: "132000000000", plannedRevenue: "155000000000", targetPercentage: "10.5" },
      { name: "Singapore - Malaysia", code: "singapore_malaysia", category: "international", level: "area", parentCode: "dong_nam_a", planned: 1987, sold: 1534, remaining: 453, recentlyBooked: 6,
        recentlyBooked30min: 2, completionRate: "77.2", revenue: "198700000000", plannedRevenue: "210000000000", targetPercentage: "9.8" },
      { name: "Lào", code: "lao", category: "international", level: "area", parentCode: "dong_nam_a", planned: 800, sold: 600, remaining: 200, recentlyBooked: 1,
        recentlyBooked30min: 2, completionRate: "75.0", revenue: "45000000000", plannedRevenue: "55000000000", targetPercentage: "7.2" },
      { name: "Campuchia", code: "campuchia", category: "international", level: "area", parentCode: "dong_nam_a", planned: 700, sold: 500, remaining: 200, recentlyBooked: 1,
        recentlyBooked30min: 2, completionRate: "71.4", revenue: "43000000000", plannedRevenue: "50000000000", targetPercentage: "6.8" },
      { name: "Indonesia", code: "indonesia", category: "international", level: "area", parentCode: "dong_nam_a", planned: 1494, sold: 716, remaining: 778, recentlyBooked: 2,
        recentlyBooked30min: 2, completionRate: "47.9", revenue: "56365000000", plannedRevenue: "70000000000", targetPercentage: "8.7" },
      
      // Domestic - Geographic Regions (Level 1) - Tổng 30min = 6+4+2 = 12
      { name: "Nội Địa", code: "noi_dia", category: "domestic", level: "geo_region", parentCode: null, planned: 15467, sold: 11245, remaining: 4222, recentlyBooked: 32,
        recentlyBooked30min: 12, completionRate: "72.7", revenue: "355680000000", plannedRevenue: "420000000000", targetPercentage: "5.2" },
      
      // Domestic - Regional Areas (Level 2) - 30min: Miền Bắc = 2+2+2 = 6, Miền Trung = 2+2 = 4, Miền Nam = 1+1 = 2
      { name: "Miền Bắc", code: "mien_bac", category: "domestic", level: "region", parentCode: "noi_dia", planned: 8000, sold: 6200, remaining: 1800, recentlyBooked: 15,
        recentlyBooked30min: 6, completionRate: "77.5", revenue: "153000000000", plannedRevenue: "185000000000", targetPercentage: "9.2" },
      { name: "Miền Trung", code: "mien_trung", category: "domestic", level: "region", parentCode: "noi_dia", planned: 4268, sold: 3156, remaining: 1112, recentlyBooked: 12,
        recentlyBooked30min: 4, completionRate: "74.0", revenue: "98700000000", plannedRevenue: "125000000000", targetPercentage: "6.3" },
      { name: "Miền Nam", code: "mien_nam", category: "domestic", level: "region", parentCode: "noi_dia", planned: 3199, sold: 1889, remaining: 1310, recentlyBooked: 5,
        recentlyBooked30min: 2, completionRate: "59.1", revenue: "104000000000", plannedRevenue: "130000000000", targetPercentage: "2.8" },
      
      // Domestic - Specific Areas (Level 3) - Đã tính toán chính xác
      // Miền Bắc: 8.000 (kế hoạch) = 3.752 + 2.500 + 1.748, 6.200 (đã bán) = 2.845 + 1.890 + 1.465 = 6.200
      { name: "ĐBSH&DH", code: "dbsh_dh", category: "domestic", level: "area", parentCode: "mien_bac", planned: 3752, sold: 2845, remaining: 907, recentlyBooked: 8,
        recentlyBooked30min: 2, completionRate: "75.8", revenue: "60000000000", plannedRevenue: "75000000000", targetPercentage: "8.1" },
      { name: "Tây Bắc", code: "tay_bac", category: "domestic", level: "area", parentCode: "mien_bac", planned: 2500, sold: 1890, remaining: 610, recentlyBooked: 5,
        recentlyBooked30min: 2, completionRate: "75.6", revenue: "45000000000", plannedRevenue: "58000000000", targetPercentage: "7.3" },
      { name: "Duyên Hải Miền Bắc", code: "duyen_hai_bac", category: "domestic", level: "area", parentCode: "mien_bac", planned: 1748, sold: 1465, remaining: 283, recentlyBooked: 2,
        recentlyBooked30min: 2, completionRate: "83.8", revenue: "48000000000", plannedRevenue: "62000000000", targetPercentage: "7.8" },
      // Miền Trung: 4.268 (kế hoạch) = 2.200 + 2.068 = 4.268, 3.156 (đã bán) = 1.650 + 1.506 = 3.156
      { name: "Tây Nguyên", code: "tay_nguyen", category: "domestic", level: "area", parentCode: "mien_trung", planned: 2200, sold: 1650, remaining: 550, recentlyBooked: 6,
        recentlyBooked30min: 2, completionRate: "75.0", revenue: "48500000000", plannedRevenue: "62000000000", targetPercentage: "5.8" },
      { name: "Miền Trung Duyên Hải", code: "mt_duyen_hai", category: "domestic", level: "area", parentCode: "mien_trung", planned: 2068, sold: 1506, remaining: 562, recentlyBooked: 6,
        recentlyBooked30min: 2, completionRate: "72.8", revenue: "50200000000", plannedRevenue: "63000000000", targetPercentage: "6.8" },
      // Miền Nam: 30min = 1+1 = 2
      { name: "Tây Nam Bộ", code: "tay_nam_bo", category: "domestic", level: "area", parentCode: "mien_nam", planned: 1665, sold: 998, remaining: 667, recentlyBooked: 3,
        recentlyBooked30min: 1, completionRate: "59.9", revenue: "52000000000", plannedRevenue: "68000000000", targetPercentage: "3.1" },
      { name: "Đông Nam Bộ", code: "dong_nam_bo", category: "domestic", level: "area", parentCode: "mien_nam", planned: 1534, sold: 891, remaining: 643, recentlyBooked: 2,
        recentlyBooked30min: 1, completionRate: "58.1", revenue: "52000000000", plannedRevenue: "65000000000", targetPercentage: "4.2" },
    ];

    hierarchyData.forEach(levelData => {
      const level: HierarchyLevel = { 
        id: randomUUID(),
        name: levelData.name,
        category: levelData.category,
        code: levelData.code,
        level: levelData.level,
        parentCode: levelData.parentCode || null,
        planned: levelData.planned || 0,
        sold: levelData.sold || 0,
        remaining: levelData.remaining || 0,
        recentlyBooked: levelData.recentlyBooked || 0,
        recentlyBooked30min: levelData.recentlyBooked30min || 0,
        completionRate: levelData.completionRate || "0",
        revenue: levelData.revenue || "0",
        plannedRevenue: levelData.plannedRevenue || "0",
        targetPercentage: levelData.targetPercentage || "0"
      };
      this.hierarchyLevels.set(level.id, level);
    });

    // Initialize tours with new structure
    const toursData: InsertTour[] = [
      // Domestic Tours - Individual Tours (Level 4)
      {
        name: "Hạ Long - Sapa",
        category: "domestic",
        continent: null,
        geoRegion: "noi_dia", 
        area: "dbsh_dh",
        duration: "3N2D",
        imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        planned: 3752,
        sold: 2634,
        remaining: 907,
        recentlyBooked: 8,
        recentlyBooked30min: 2,
        completionRate: "92.6",
        dailyRevenue: "12500000000", // Doanh thư hôm nay
        revenue: "60000000000",
        plannedRevenue: "75000000000", // Doanh thu kế hoạch
        targetPercentage: "8.1",
        topSalesUnit: "HN"
      },
      // Domestic Tours - Miền Nam  
      {
        name: "Phú Quốc",
        category: "domestic",
        continent: null,
        geoRegion: "noi_dia",
        area: "dong_nam_bo", 
        duration: "4N3D",
        imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        planned: 2634,
        sold: 2156,
        remaining: 643,
        recentlyBooked: 5,
        recentlyBooked30min: 2,
        completionRate: "81.8",
        dailyRevenue: "8500000000", // Doanh thư hôm nay
        revenue: "52000000000",
        plannedRevenue: "65000000000", // Doanh thu kế hoạch
        targetPercentage: "4.2",
        topSalesUnit: "HCM"
      },
      // International Tours - Đông Bắc Á
      {
        name: "Nhật Bản", 
        category: "international",
        continent: "chau_a",
        geoRegion: null,
        area: "nhat_ban",
        duration: "6N5D",
        imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        planned: 2156,
        sold: 1987,
        remaining: 169,
        recentlyBooked: 10,
        recentlyBooked30min: 2,
        completionRate: "92.2",
        dailyRevenue: "18500000000", // Doanh thư hôm nay
        revenue: "287350000000",
        plannedRevenue: "320000000000", // Doanh thu kế hoạch
        targetPercentage: "15.2",
        topSalesUnit: "HCM"
      },
      // International Tours - Đông Nam Á
      {
        name: "Singapore - Malaysia",
        category: "international", 
        continent: "chau_a",
        geoRegion: null,
        area: "singapore_malaysia",
        duration: "5N4D",
        imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        planned: 1987,
        sold: 1534,
        remaining: 453,
        recentlyBooked: 6,
        recentlyBooked30min: 2,
        completionRate: "77.2",
        dailyRevenue: "9200000000", // Doanh thư hôm nay
        revenue: "198700000000",
        plannedRevenue: "210000000000", // Doanh thu kế hoạch
        targetPercentage: "9.8",
        topSalesUnit: "HN"
      }
    ];

    toursData.forEach(tourData => {
      const tour: Tour = { 
        id: randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        name: tourData.name,
        category: tourData.category,
        continent: tourData.continent || null,
        geoRegion: tourData.geoRegion || null,
        area: tourData.area,
        duration: tourData.duration,
        imageUrl: tourData.imageUrl || null,
        planned: tourData.planned || 0,
        sold: tourData.sold || 0,
        remaining: tourData.remaining || 0,
        recentlyBooked: tourData.recentlyBooked || 0,
        recentlyBooked30min: tourData.recentlyBooked30min || 0,
        completionRate: tourData.completionRate || "0",
        dailyRevenue: tourData.dailyRevenue || "0",
        revenue: tourData.revenue || "0",
        plannedRevenue: tourData.plannedRevenue || "0",
        targetPercentage: tourData.targetPercentage || "0",
        topSalesUnit: tourData.topSalesUnit || "HN",
        isActive: true
      };
      this.tours.set(tour.id, tour);
    });

    // Initialize regional performance
    const performanceData: InsertRegionalPerformance[] = [
      { cityName: "TP. Hồ Chí Minh", performanceRate: "85.2", status: "good" },
      { cityName: "Hà Nội", performanceRate: "78.9", status: "good" },
      { cityName: "Đà Nẵng", performanceRate: "72.4", status: "moderate" },
      { cityName: "Cần Thơ", performanceRate: "68.1", status: "moderate" },
      { cityName: "Nha Trang", performanceRate: "61.7", status: "poor" },
    ];

    performanceData.forEach(perfData => {
      const performance: RegionalPerformance = { 
        id: randomUUID(),
        cityName: perfData.cityName,
        performanceRate: perfData.performanceRate || "0",
        status: perfData.status || "good"
      };
      this.regionalPerformance.set(performance.id, performance);
    });

    // Initialize recent activities
    const activitiesData: InsertActivity[] = [
      {
        type: "booking",
        message: "Tour Hạ Long - Sapa đã bán +25 chỗ",
        location: "Hồ Chí Minh"
      },
      {
        type: "price_update",
        message: "Tour Châu Âu đã mở thêm +30 chỗ",
        location: "Hà Nội"
      },
      {
        type: "new_tour",
        message: "Tour Tây Nguyên cập nhật kế hoạch - 500 chỗ",
        location: "Đà Nẵng"
      }
    ];

    activitiesData.forEach(actData => {
      const activity: Activity = { 
        id: randomUUID(),
        type: actData.type,
        message: actData.message,
        location: actData.location,
        tourId: null,
        timestamp: new Date()
      };
      this.activities.set(activity.id, activity);
    });
  }

  async getTours(): Promise<Tour[]> {
    return Array.from(this.tours.values())
      .sort((a, b) => b.recentlyBooked - a.recentlyBooked);
  }

  async getToursByCategory(category: string): Promise<Tour[]> {
    return Array.from(this.tours.values())
      .filter(tour => tour.category === category)
      .sort((a, b) => b.recentlyBooked - a.recentlyBooked);
  }

  async getToursByArea(areaCode: string): Promise<Tour[]> {
    return Array.from(this.tours.values())
      .filter(tour => tour.area === areaCode)
      .sort((a, b) => b.recentlyBooked - a.recentlyBooked);
  }

  async getToursBySalesUnit(salesUnitCode: string): Promise<Tour[]> {
    return Array.from(this.tours.values())
      .filter(tour => tour.topSalesUnit === salesUnitCode)
      .sort((a, b) => b.recentlyBooked - a.recentlyBooked);
  }

  async createTour(insertTour: InsertTour): Promise<Tour> {
    const id = randomUUID();
    const tour: Tour = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: insertTour.name,
      category: insertTour.category,
      continent: insertTour.continent ?? null,
      geoRegion: insertTour.geoRegion ?? null,
      area: insertTour.area,
      duration: insertTour.duration,
      imageUrl: insertTour.imageUrl ?? null,
      planned: insertTour.planned ?? 0,
      sold: insertTour.sold ?? 0,
      remaining: insertTour.remaining ?? 0,
      recentlyBooked: insertTour.recentlyBooked ?? 0,
      recentlyBooked30min: insertTour.recentlyBooked30min ?? 0,
      completionRate: insertTour.completionRate ?? "0",
      dailyRevenue: insertTour.dailyRevenue ?? "0",
      revenue: insertTour.revenue ?? "0",
      plannedRevenue: insertTour.plannedRevenue ?? "0",
      targetPercentage: insertTour.targetPercentage ?? "0",
      topSalesUnit: insertTour.topSalesUnit ?? "HCM",
      isActive: insertTour.isActive ?? true
    };
    this.tours.set(id, tour);
    return tour;
  }

  async updateTour(id: string, tourUpdate: Partial<Tour>): Promise<Tour | undefined> {
    const tour = this.tours.get(id);
    if (!tour) return undefined;
    
    const updatedTour: Tour = { ...tour, ...tourUpdate, updatedAt: new Date() };
    this.tours.set(id, updatedTour);
    return updatedTour;
  }

  async getHierarchyLevels(): Promise<HierarchyLevel[]> {
    return Array.from(this.hierarchyLevels.values())
      .sort((a, b) => b.recentlyBooked - a.recentlyBooked);
  }

  async getHierarchyLevelsByCategory(category: string): Promise<HierarchyLevel[]> {
    return Array.from(this.hierarchyLevels.values())
      .filter(level => level.category === category)
      .sort((a, b) => b.recentlyBooked - a.recentlyBooked);
  }

  async getHierarchyLevelsByLevel(level: string): Promise<HierarchyLevel[]> {
    return Array.from(this.hierarchyLevels.values())
      .filter(h => h.level === level)
      .sort((a, b) => b.recentlyBooked - a.recentlyBooked);
  }

  async createHierarchyLevel(insertLevel: InsertHierarchyLevel): Promise<HierarchyLevel> {
    const id = randomUUID();
    const level: HierarchyLevel = { 
      id,
      name: insertLevel.name,
      category: insertLevel.category,
      code: insertLevel.code,
      level: insertLevel.level,
      parentCode: insertLevel.parentCode ?? null,
      planned: insertLevel.planned ?? 0,
      sold: insertLevel.sold ?? 0,
      remaining: insertLevel.remaining ?? 0,
      recentlyBooked: insertLevel.recentlyBooked ?? 0,
      recentlyBooked30min: insertLevel.recentlyBooked30min ?? 0,
      completionRate: insertLevel.completionRate ?? "0",
      revenue: insertLevel.revenue ?? "0",
      plannedRevenue: insertLevel.plannedRevenue ?? "0",
      targetPercentage: insertLevel.targetPercentage ?? "0"
    };
    this.hierarchyLevels.set(id, level);
    return level;
  }

  async updateHierarchyLevel(id: string, levelUpdate: Partial<HierarchyLevel>): Promise<HierarchyLevel | undefined> {
    const level = this.hierarchyLevels.get(id);
    if (!level) return undefined;
    
    const updatedLevel: HierarchyLevel = { ...level, ...levelUpdate };
    this.hierarchyLevels.set(id, updatedLevel);
    return updatedLevel;
  }

  async getSalesUnits(): Promise<SalesUnit[]> {
    return Array.from(this.salesUnits.values());
  }

  async createSalesUnit(insertUnit: InsertSalesUnit): Promise<SalesUnit> {
    const id = randomUUID();
    const unit: SalesUnit = { 
      id,
      name: insertUnit.name,
      code: insertUnit.code,
      performanceRate: insertUnit.performanceRate ?? "0",
      status: insertUnit.status ?? "good"
    };
    this.salesUnits.set(id, unit);
    return unit;
  }

  async updateSalesUnit(id: string, unitUpdate: Partial<SalesUnit>): Promise<SalesUnit | undefined> {
    const unit = this.salesUnits.get(id);
    if (!unit) return undefined;
    
    const updatedUnit: SalesUnit = { ...unit, ...unitUpdate };
    this.salesUnits.set(id, updatedUnit);
    return updatedUnit;
  }

  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))
      .slice(0, limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const activity: Activity = { 
      id,
      type: insertActivity.type,
      message: insertActivity.message,
      location: insertActivity.location,
      tourId: insertActivity.tourId ?? null,
      timestamp: new Date()
    };
    this.activities.set(id, activity);
    return activity;
  }

  async getRegionalPerformance(): Promise<RegionalPerformance[]> {
    return Array.from(this.regionalPerformance.values())
      .sort((a, b) => parseFloat(b.performanceRate) - parseFloat(a.performanceRate));
  }

  async createRegionalPerformance(insertPerformance: InsertRegionalPerformance): Promise<RegionalPerformance> {
    const id = randomUUID();
    const performance: RegionalPerformance = { 
      id,
      cityName: insertPerformance.cityName,
      performanceRate: insertPerformance.performanceRate ?? "0",
      status: insertPerformance.status ?? "good"
    };
    this.regionalPerformance.set(id, performance);
    return performance;
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const tours = Array.from(this.tours.values());
    const hierarchyLevels = Array.from(this.hierarchyLevels.values());
    
    const totalActiveTours = tours.length;
    
    // Calculate from hierarchy levels data (more comprehensive than tours data)
    const totalSold = hierarchyLevels.reduce((sum, level) => sum + level.sold, 0);
    const totalPlanned = hierarchyLevels.reduce((sum, level) => sum + level.planned, 0);
    const totalRevenue = hierarchyLevels.reduce((sum, level) => sum + parseFloat(level.revenue), 0);
    const totalPlannedRevenue = hierarchyLevels.reduce((sum, level) => sum + parseFloat(level.plannedRevenue), 0);
    const totalDailyBookings = hierarchyLevels.reduce((sum, level) => sum + level.recentlyBooked30min, 0);
    
    // Calculate total daily revenue from all tours
    const totalDailyRevenue = tours.reduce((sum, tour) => sum + parseFloat(tour.dailyRevenue || "0"), 0);
    
    // Calculate percentage vs plan for tours sold
    const toursSoldPlanPercentage = totalPlanned > 0 ? parseFloat(((totalSold / totalPlanned) * 100).toFixed(1)) : 0;
    
    // Calculate revenue percentage vs plan: Tổng Doanh Thu / Doanh thu Kế Hoạch
    const revenuePlanPercentage = totalPlannedRevenue > 0 ? parseFloat(((totalRevenue / totalPlannedRevenue) * 100).toFixed(1)) : 0;
    
    // Previous values for change calculation
    const yesterdayBookings = Math.floor(Math.random() * 5) + 2;
    const dailyBookingsChange = totalDailyBookings - yesterdayBookings;
    
    return {
      totalActiveTours: totalActiveTours,
      totalActiveToursChange: 12.5,
      dailyBookings: totalDailyBookings, // Tổng từ cột "Số Chỗ Bán Hôm Nay"
      dailyBookingsChange: dailyBookingsChange,
      dailyRevenue: (totalDailyRevenue / 1000000000).toFixed(1) + "B VND", // Tổng từ cột "Doanh thư hôm nay"
      dailyRevenueChange: 8.3,
      toursSold: totalSold, // Tổng từ cột "Đã bán"
      toursSoldChange: -3.2, // Keep for compatibility, but will show percentage instead
      toursSoldPlanPercentage: toursSoldPlanPercentage, // % so với kế hoạch
      revenue: (totalRevenue / 1000000000).toFixed(1) + "B VND", // Tổng từ cột "Doanh Thu"
      revenueChange: 5.2, // Revenue change percentage
      revenuePlanPercentage: revenuePlanPercentage, // % = Tổng Doanh Thu / Doanh thu Kế Hoạch
      completionRate: totalPlanned > 0 ? parseFloat(((totalSold / totalPlanned) * 100).toFixed(1)) : 0,
    };
  }
}

export const storage = new MemStorage();

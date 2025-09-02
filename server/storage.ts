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
      // International - Level 1: Tour Quốc tế
      {
        name: "TOUR QUỐC TẾ",
        code: "tour_quoc_te",
        category: "international",
        level: "tour_category",
        parentCode: null,
        planned: 4976,
        sold: 2665,
        remaining: 2311,
        opensell: 3278,
        recentlyBooked: 430,
        recentlyBooked30min: 143,
        completionRate: "13.4",
        plannedRevenue: "60962750000",
        revenue: "8089550000",
        openRevenue: "71726000000",
        targetPercentage: "75"
      },
      // Domestic - Level 1: Tour Nội địa
      {
        name: "TOUR NỘI ĐỊA",
        code: "tour_noi_dia",
        category: "domestic",
        level: "tour_category",
        parentCode: null,
        planned: 3200,
        sold: 2150,
        remaining: 1050,
        opensell: 1750,
        recentlyBooked: 285,
        recentlyBooked30min: 95,
        completionRate: "67.2",
        plannedRevenue: "45500000000",
        revenue: "35200000000",
        openRevenue: "28900000000",
        targetPercentage: "82"
      }
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
        opensell: levelData.opensell || 0,
        recentlyBooked: levelData.recentlyBooked || 0,
        recentlyBooked30min: levelData.recentlyBooked30min || 0,
        completionRate: levelData.completionRate || "0",
        revenue: levelData.revenue || "0",
        openRevenue: levelData.openRevenue || "0",
        plannedRevenue: levelData.plannedRevenue || "0",
        targetPercentage: levelData.targetPercentage || "0"
      };
      this.hierarchyLevels.set(level.id, level);
    });

    // Initialize tours with sample data
    const toursData: InsertTour[] = [
      {
        name: "Lâm Đồng",
        category: "domestic",
        continent: null,
        geoRegion: "noi_dia",
        area: "tay_nguyen",
        imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        planned: 104,
        sold: 165,
        remaining: -61,
        opensell: 75,
        recentlyBooked: 169,
        recentlyBooked30min: 21,
        completionRate: "158.8",
        dailyRevenue: "7935000000",
        revenue: "7185000000",
        openRevenue: "-3290000000",
        plannedRevenue: "3895000000",
        targetPercentage: "184",
        topSalesUnit: "HN"
      },
      {
        name: "Phú Quốc",
        category: "domestic",
        continent: null,
        geoRegion: "noi_dia",
        area: "tay_nam_bo",
        imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        planned: 237,
        sold: 438,
        remaining: -201,
        opensell: 150,
        recentlyBooked: 472,
        recentlyBooked30min: 13,
        completionRate: "184.7",
        dailyRevenue: "1771500000",
        revenue: "1849500000",
        openRevenue: "2500000000",
        plannedRevenue: "1601000000",
        targetPercentage: "115",
        topSalesUnit: "HCM"
      },
      {
        name: "Hà Nội",
        category: "domestic",
        continent: null,
        geoRegion: "noi_dia",
        area: "dong_bac",
        imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        planned: 320,
        sold: 280,
        remaining: 40,
        opensell: 95,
        recentlyBooked: 45,
        recentlyBooked30min: 12,
        completionRate: "87.5",
        dailyRevenue: "3200000000",
        revenue: "4500000000",
        openRevenue: "1800000000",
        plannedRevenue: "5200000000",
        targetPercentage: "86",
        topSalesUnit: "HN"
      },
      {
        name: "Thái Lan",
        category: "international",
        continent: "chau_a",
        geoRegion: null,
        area: "thai_lan",
        imageUrl: "https://images.unsplash.com/photo-1571211905393-9ffd0dd5b9a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        planned: 1500,
        sold: 1200,
        remaining: 300,
        opensell: 450,
        recentlyBooked: 89,
        recentlyBooked30min: 23,
        completionRate: "80.0",
        dailyRevenue: "12000000000",
        revenue: "85000000000",
        openRevenue: "25000000000",
        plannedRevenue: "90000000000",
        targetPercentage: "94",
        topSalesUnit: "HCM"
      },
      {
        name: "Singapore",
        category: "international",
        continent: "chau_a",
        geoRegion: null,
        area: "singapore",
        imageUrl: "https://images.unsplash.com/photo-1571211905393-9ffd0dd5b9a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        planned: 800,
        sold: 650,
        remaining: 150,
        opensell: 225,
        recentlyBooked: 34,
        recentlyBooked30min: 8,
        completionRate: "81.3",
        dailyRevenue: "8500000000",
        revenue: "42000000000",
        openRevenue: "15000000000",
        plannedRevenue: "48000000000",
        targetPercentage: "87",
        topSalesUnit: "HCM"
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
        imageUrl: tourData.imageUrl || null,
        planned: tourData.planned || 0,
        sold: tourData.sold || 0,
        remaining: tourData.remaining || 0,
        opensell: tourData.opensell || 0,
        recentlyBooked: tourData.recentlyBooked || 0,
        recentlyBooked30min: tourData.recentlyBooked30min || 0,
        completionRate: tourData.completionRate || "0",
        dailyRevenue: tourData.dailyRevenue || "0",
        revenue: tourData.revenue || "0",
        openRevenue: tourData.openRevenue || "0",
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

    // Initialize activities
    const activitiesData: InsertActivity[] = [
      { type: "booking", message: "Đặt tour Phú Quốc thành công", tourId: null, location: "TP. Hồ Chí Minh" },
      { type: "price_update", message: "Cập nhật giá tour Lâm Đồng", tourId: null, location: "Hà Nội" },
      { type: "new_tour", message: "Thêm tour mới Thái Lan", tourId: null, location: "TP. Hồ Chí Minh" },
      { type: "booking", message: "Đặt tour Singapore thành công", tourId: null, location: "Cần Thơ" },
      { type: "booking", message: "Đặt tour Hà Nội thành công", tourId: null, location: "TP. Hồ Chí Minh" },
    ];

    activitiesData.forEach(activityData => {
      const activity: Activity = {
        id: randomUUID(),
        type: activityData.type,
        message: activityData.message,
        tourId: activityData.tourId || null,
        location: activityData.location,
        timestamp: new Date()
      };
      this.activities.set(activity.id, activity);
    });
  }

  // Tours methods
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
      imageUrl: insertTour.imageUrl ?? null,
      planned: insertTour.planned ?? 0,
      sold: insertTour.sold ?? 0,
      remaining: insertTour.remaining ?? 0,
      opensell: insertTour.opensell ?? 0,
      recentlyBooked: insertTour.recentlyBooked ?? 0,
      recentlyBooked30min: insertTour.recentlyBooked30min ?? 0,
      completionRate: insertTour.completionRate ?? "0",
      dailyRevenue: insertTour.dailyRevenue ?? "0",
      revenue: insertTour.revenue ?? "0",
      openRevenue: insertTour.openRevenue ?? "0",
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

  // Hierarchy methods
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
      opensell: insertLevel.opensell ?? 0,
      recentlyBooked: insertLevel.recentlyBooked ?? 0,
      recentlyBooked30min: insertLevel.recentlyBooked30min ?? 0,
      completionRate: insertLevel.completionRate ?? "0",
      revenue: insertLevel.revenue ?? "0",
      openRevenue: insertLevel.openRevenue ?? "0",
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

  // Sales Units methods
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

  // Activities methods
  async getRecentActivities(limit: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime())
      .slice(0, limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const activity: Activity = {
      id,
      type: insertActivity.type,
      message: insertActivity.message,
      tourId: insertActivity.tourId ?? null,
      location: insertActivity.location,
      timestamp: new Date()
    };
    this.activities.set(id, activity);
    return activity;
  }

  // Regional Performance methods
  async getRegionalPerformance(): Promise<RegionalPerformance[]> {
    return Array.from(this.regionalPerformance.values());
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

  // Dashboard Metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const tours = await this.getTours();
    const activeTours = tours.filter(t => t.isActive);
    
    const totalRevenue = activeTours.reduce((sum, tour) => {
      const revenue = parseFloat(tour.revenue.replace(/[^\d.-]/g, '') || '0');
      return sum + revenue;
    }, 0);

    const totalDailyRevenue = activeTours.reduce((sum, tour) => {
      const dailyRevenue = parseFloat(tour.dailyRevenue.replace(/[^\d.-]/g, '') || '0');
      return sum + dailyRevenue;
    }, 0);

    const totalPlanned = activeTours.reduce((sum, tour) => sum + tour.planned, 0);
    const totalSold = activeTours.reduce((sum, tour) => sum + tour.sold, 0);
    const totalRemaining = activeTours.reduce((sum, tour) => sum + tour.remaining, 0);
    const totalDailyBookings = activeTours.reduce((sum, tour) => sum + tour.recentlyBooked30min, 0);

    const toursSoldPlanPercentage = totalPlanned > 0 ? parseFloat(((totalSold / totalPlanned) * 100).toFixed(1)) : 0;
    const revenuePlanPercentage = totalPlanned > 0 ? parseFloat(((totalRevenue / (totalPlanned * 50000000)) * 100).toFixed(1)) : 0;

    return {
      totalActiveTours: activeTours.length,
      totalActiveToursChange: 5, // Mock change
      dailyBookings: totalDailyBookings,
      dailyBookingsChange: 12, // Mock change 
      dailyRevenue: (totalDailyRevenue / 1000000).toLocaleString() + " Tr VND",
      dailyRevenueChange: 8.5, // Mock change
      toursSold: totalSold,
      toursSoldChange: 3.2, // Mock change
      toursSoldPlanPercentage: toursSoldPlanPercentage,
      revenue: (totalRevenue / 1000000).toLocaleString() + " Tr VND",
      revenueChange: 5.8, // Mock change
      revenuePlanPercentage: revenuePlanPercentage,
      completionRate: toursSoldPlanPercentage
    };
  }
}

export const storage = new MemStorage();
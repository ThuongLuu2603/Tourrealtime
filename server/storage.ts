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
        recentlyBooked: 430,
        recentlyBooked30min: 143,
        completionRate: "13.4",
        plannedRevenue: "60962750000",
        revenue: "8089550000",
        targetPercentage: "75"
      },
      // International - Level 2: Châu lục - Châu Á
      {
        name: "Châu Á",
        code: "chau_a",
        category: "international",
        level: "continent",
        parentCode: "tour_quoc_te",
        planned: 4515,
        sold: 2312,
        remaining: 2203,
        recentlyBooked: 335,
        recentlyBooked30min: 84,
        completionRate: "51.1",
        plannedRevenue: "40395500000",
        revenue: "57968250000",
        targetPercentage: "70"
      },
      {
        name: "Châu Âu",
        code: "chau_au",
        category: "international",
        level: "continent",
        parentCode: "tour_quoc_te",
        planned: 246,
        sold: 222,
        remaining: 24,
        recentlyBooked: 28,
        recentlyBooked30min: 9,
        completionRate: "90.3",
        plannedRevenue: "15235250000",
        revenue: "13165750000",
        targetPercentage: "116"
      },
      {
        name: "Châu Đại Dương",
        code: "chau_dai_duong",
        category: "international",
        level: "continent",
        parentCode: "tour_quoc_te",
        planned: 117,
        sold: 96,
        remaining: 21,
        recentlyBooked: 31,
        recentlyBooked30min: 10,
        completionRate: "82.1",
        plannedRevenue: "1716000000",
        revenue: "2433750000",
        targetPercentage: "149"
      },
      {
        name: "Châu Mỹ",
        code: "chau_my",
        category: "international",
        level: "continent",
        parentCode: "tour_quoc_te",
        planned: 98,
        sold: 35,
        remaining: 62,
        recentlyBooked: 6,
        recentlyBooked30min: 1,
        completionRate: "36",
        plannedRevenue: "521500000",
        revenue: "121300000",
        targetPercentage: "20"
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
        recentlyBooked: levelData.recentlyBooked || 0,
        recentlyBooked30min: levelData.recentlyBooked30min || 0,
        completionRate: levelData.completionRate || "0",
        revenue: levelData.revenue || "0",
        plannedRevenue: levelData.plannedRevenue || "0",
        targetPercentage: levelData.targetPercentage || "0"
      };
      this.hierarchyLevels.set(level.id, level);
    });

    // Initialize sample tours data
    const toursData: InsertTour[] = [
      {
        name: "Du lịch Singapore - Malaysia 4N3Đ",
        category: "international",
        continent: "chau_a",
        area: "dong_nam_a",
        duration: "4N3D",
        planned: 150,
        sold: 120,
        remaining: 30,
        recentlyBooked: 15,
        recentlyBooked30min: 5,
        completionRate: "80.0",
        dailyRevenue: "45000000",
        revenue: "2400000000",
        plannedRevenue: "3000000000",
        targetPercentage: "80.0",
        topSalesUnit: "HCM"
      },
      {
        name: "Tour Nhật Bản 5N4Đ",
        category: "international",
        continent: "chau_a", 
        area: "dong_bac_a",
        duration: "5N4D",
        planned: 200,
        sold: 180,
        remaining: 20,
        recentlyBooked: 25,
        recentlyBooked30min: 8,
        completionRate: "90.0",
        dailyRevenue: "75000000",
        revenue: "7200000000",
        plannedRevenue: "8000000000",
        targetPercentage: "90.0",
        topSalesUnit: "HN"
      }
    ];

    toursData.forEach(tourData => {
      const tour: Tour = {
        id: randomUUID(),
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
        topSalesUnit: tourData.topSalesUnit || "HCM",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.tours.set(tour.id, tour);
    });

    // Initialize Activities
    const activitiesData: InsertActivity[] = [
      {
        type: "booking",
        message: "Khách hàng vừa đặt tour Singapore - Malaysia",
        tourId: null,
        location: "TP. Hồ Chí Minh"
      },
      {
        type: "booking", 
        message: "Đặt tour Nhật Bản 5N4Đ",
        tourId: null,
        location: "Hà Nội"
      },
      {
        type: "price_update",
        message: "Cập nhật giá tour Châu Âu",
        tourId: null,
        location: "Cần Thơ"
      }
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

    // Initialize Regional Performance
    const regionalData: InsertRegionalPerformance[] = [
      { cityName: "TP. Hồ Chí Minh", performanceRate: "85.2", status: "good" },
      { cityName: "Hà Nội", performanceRate: "78.9", status: "good" },
      { cityName: "Cần Thơ", performanceRate: "72.4", status: "moderate" },
      { cityName: "Đà Nẵng", performanceRate: "68.1", status: "moderate" }
    ];

    regionalData.forEach(regionData => {
      const region: RegionalPerformance = {
        id: randomUUID(),
        cityName: regionData.cityName,
        performanceRate: regionData.performanceRate,
        status: regionData.status || "good"
      };
      this.regionalPerformance.set(region.id, region);
    });
  }

  // Tours methods
  async getTours(): Promise<Tour[]> {
    return Array.from(this.tours.values());
  }

  async getToursByCategory(category: string): Promise<Tour[]> {
    return Array.from(this.tours.values()).filter(tour => tour.category === category);
  }

  async getToursByArea(areaCode: string): Promise<Tour[]> {
    return Array.from(this.tours.values()).filter(tour => tour.area === areaCode);
  }

  async getToursBySalesUnit(salesUnitCode: string): Promise<Tour[]> {
    return Array.from(this.tours.values()).filter(tour => tour.topSalesUnit === salesUnitCode);
  }

  async createTour(tourData: InsertTour): Promise<Tour> {
    const tour: Tour = {
      id: randomUUID(),
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
      topSalesUnit: tourData.topSalesUnit || "HCM",
      isActive: tourData.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.tours.set(tour.id, tour);
    return tour;
  }

  async updateTour(id: string, updateData: Partial<Tour>): Promise<Tour | undefined> {
    const tour = this.tours.get(id);
    if (!tour) return undefined;
    
    const updatedTour = { ...tour, ...updateData, updatedAt: new Date() };
    this.tours.set(id, updatedTour);
    return updatedTour;
  }

  // Hierarchy Levels methods
  async getHierarchyLevels(): Promise<HierarchyLevel[]> {
    return Array.from(this.hierarchyLevels.values());
  }

  async getHierarchyLevelsByCategory(category: string): Promise<HierarchyLevel[]> {
    return Array.from(this.hierarchyLevels.values()).filter(level => level.category === category);
  }

  async getHierarchyLevelsByLevel(level: string): Promise<HierarchyLevel[]> {
    return Array.from(this.hierarchyLevels.values()).filter(l => l.level === level);
  }

  async createHierarchyLevel(levelData: InsertHierarchyLevel): Promise<HierarchyLevel> {
    const level: HierarchyLevel = {
      id: randomUUID(),
      name: levelData.name,
      code: levelData.code,
      category: levelData.category,
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
    return level;
  }

  async updateHierarchyLevel(id: string, updateData: Partial<HierarchyLevel>): Promise<HierarchyLevel | undefined> {
    const level = this.hierarchyLevels.get(id);
    if (!level) return undefined;
    
    const updatedLevel = { ...level, ...updateData };
    this.hierarchyLevels.set(id, updatedLevel);
    return updatedLevel;
  }

  // Sales Units methods
  async getSalesUnits(): Promise<SalesUnit[]> {
    return Array.from(this.salesUnits.values());
  }

  async createSalesUnit(unitData: InsertSalesUnit): Promise<SalesUnit> {
    const unit: SalesUnit = {
      id: randomUUID(),
      name: unitData.name,
      code: unitData.code,
      performanceRate: unitData.performanceRate || "0",
      status: unitData.status || "good"
    };
    this.salesUnits.set(unit.id, unit);
    return unit;
  }

  async updateSalesUnit(id: string, updateData: Partial<SalesUnit>): Promise<SalesUnit | undefined> {
    const unit = this.salesUnits.get(id);
    if (!unit) return undefined;
    
    const updatedUnit = { ...unit, ...updateData };
    this.salesUnits.set(id, updatedUnit);
    return updatedUnit;
  }

  // Activities methods
  async getRecentActivities(limit: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => b.timestamp!.getTime() - a.timestamp!.getTime())
      .slice(0, limit);
  }

  async createActivity(activityData: InsertActivity): Promise<Activity> {
    const activity: Activity = {
      id: randomUUID(),
      type: activityData.type,
      message: activityData.message,
      tourId: activityData.tourId || null,
      location: activityData.location,
      timestamp: new Date()
    };
    this.activities.set(activity.id, activity);
    return activity;
  }

  // Regional Performance methods
  async getRegionalPerformance(): Promise<RegionalPerformance[]> {
    return Array.from(this.regionalPerformance.values());
  }

  async createRegionalPerformance(performanceData: InsertRegionalPerformance): Promise<RegionalPerformance> {
    const performance: RegionalPerformance = {
      id: randomUUID(),
      cityName: performanceData.cityName,
      performanceRate: performanceData.performanceRate,
      status: performanceData.status || "good"
    };
    this.regionalPerformance.set(performance.id, performance);
    return performance;
  }

  // Dashboard Metrics method
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const tours = Array.from(this.tours.values());
    const hierarchyLevels = Array.from(this.hierarchyLevels.values());

    const totalActiveTours = tours.filter(tour => tour.isActive).length;
    const dailyBookings = tours.reduce((sum, tour) => sum + tour.recentlyBooked30min, 0);
    const toursSold = tours.reduce((sum, tour) => sum + tour.sold, 0);
    const plannedTotal = tours.reduce((sum, tour) => sum + tour.planned, 0);
    const revenueTotal = tours.reduce((sum, tour) => sum + Number(tour.revenue), 0);
    const plannedRevenueTotal = tours.reduce((sum, tour) => sum + Number(tour.plannedRevenue), 0);

    return {
      totalActiveTours,
      totalActiveToursChange: 5.2,
      dailyBookings,
      dailyBookingsChange: 12.5,
      dailyRevenue: "120000000", 
      dailyRevenueChange: 8.3,
      toursSold,
      toursSoldChange: -3.2,
      toursSoldPlanPercentage: plannedTotal > 0 ? Math.round((toursSold / plannedTotal) * 100) : 0,
      revenue: revenueTotal.toString(),
      revenueChange: 15.7,
      revenuePlanPercentage: plannedRevenueTotal > 0 ? Math.round((revenueTotal / plannedRevenueTotal) * 100) : 0,
      completionRate: plannedTotal > 0 ? Math.round((toursSold / plannedTotal) * 100) : 0
    };
  }
}

export const storage = new MemStorage();
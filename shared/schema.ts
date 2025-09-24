import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tours = pgTable("tours", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'domestic' or 'international'
  continent: text("continent"), // For international: 'chau_a', 'chau_au', etc.
  geoRegion: text("geo_region"), // For domestic: 'mien_bac', 'mien_trung', 'mien_nam'
  area: text("area").notNull(), // Specific area like 'dong_bac_a', 'tay_nguyen', etc.
  imageUrl: text("image_url"),
  planned: integer("planned").notNull().default(0),
  sold: integer("sold").notNull().default(0),
  remaining: integer("remaining").notNull().default(0),
  opensell: integer("opensell").notNull().default(0), // LK Mở bán
  recentlyBooked: integer("recently_booked").notNull().default(0),
  recentlyBooked30min: integer("recently_booked_30min").notNull().default(0),
  completionRate: decimal("completion_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  dailyRevenue: decimal("daily_revenue", { precision: 15, scale: 2 }).notNull().default("0"), // Doanh thư hôm nay
  revenue: decimal("revenue", { precision: 15, scale: 2 }).notNull().default("0"),
  openRevenue: decimal("open_revenue", { precision: 15, scale: 2 }).notNull().default("0"), // DS Mở bán
  plannedRevenue: decimal("planned_revenue", { precision: 15, scale: 2 }).notNull().default("0"), // Doanh thu kế hoạch
  targetPercentage: decimal("target_percentage", { precision: 5, scale: 2 }).notNull().default("0"),
  topSalesUnit: text("top_sales_unit").notNull().default("HCM"), // 'HCM', 'HN', 'CT'
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Hierarchy levels for tours
export const hierarchyLevels = pgTable("hierarchy_levels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  category: text("category").notNull(), // 'domestic' or 'international'
  level: text("level").notNull(), // 'continent', 'geo_region', 'area'
  parentCode: text("parent_code"), // Reference to parent level
  planned: integer("planned").notNull().default(0),
  sold: integer("sold").notNull().default(0),
  remaining: integer("remaining").notNull().default(0),
  opensell: integer("opensell").notNull().default(0), // LK Mở bán
  recentlyBooked: integer("recently_booked").notNull().default(0),
  recentlyBooked30min: integer("recently_booked_30min").notNull().default(0),
  completionRate: decimal("completion_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  revenue: decimal("revenue", { precision: 15, scale: 2 }).notNull().default("0"),
  openRevenue: decimal("open_revenue", { precision: 15, scale: 2 }).notNull().default("0"), // DS Mở bán
  plannedRevenue: decimal("planned_revenue", { precision: 15, scale: 2 }).notNull().default("0"), // Doanh thu kế hoạch
  targetPercentage: decimal("target_percentage", { precision: 5, scale: 2 }).notNull().default("0"),
});

// Sales units (HCM, HN, Can Tho)
export const salesUnits = pgTable("sales_units", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  code: text("code").notNull().unique(), // 'HCM', 'HN', 'CT'
  performanceRate: decimal("performance_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  status: text("status").notNull().default("good"), // 'good', 'moderate', 'poor'
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'booking', 'price_update', 'new_tour'
  message: text("message").notNull(),
  tourId: varchar("tour_id"),
  location: text("location").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const regionalPerformance = pgTable("regional_performance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cityName: text("city_name").notNull(),
  performanceRate: decimal("performance_rate", { precision: 5, scale: 2 }).notNull(),
  status: text("status").notNull().default("good"), // 'good', 'moderate', 'poor'
});

export const insertTourSchema = createInsertSchema(tours).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHierarchyLevelSchema = createInsertSchema(hierarchyLevels).omit({
  id: true,
});

export const insertSalesUnitSchema = createInsertSchema(salesUnits).omit({
  id: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  timestamp: true,
});

export const insertRegionalPerformanceSchema = createInsertSchema(regionalPerformance).omit({
  id: true,
});

export type InsertTour = z.infer<typeof insertTourSchema>;
export type Tour = typeof tours.$inferSelect;

export type InsertHierarchyLevel = z.infer<typeof insertHierarchyLevelSchema>;
export type HierarchyLevel = typeof hierarchyLevels.$inferSelect;

export type InsertSalesUnit = z.infer<typeof insertSalesUnitSchema>;
export type SalesUnit = typeof salesUnits.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export type InsertRegionalPerformance = z.infer<typeof insertRegionalPerformanceSchema>;
export type RegionalPerformance = typeof regionalPerformance.$inferSelect;

// Dashboard metrics type
export type DashboardMetrics = {
  totalActiveTours: number;
  totalActiveToursChange: number;
  dailyBookings: number; // Tổng từ cột "Số Chỗ Bán Hôm Nay" (recentlyBooked30min)
  dailyBookingsChange: number;
  weeklyBookingsChange: number; // So sánh với cùng kỳ tuần trước
  dailyRevenue: string;
  dailyRevenueChange: number;
  weeklyRevenueChange: number; // So sánh doanh thu với cùng kỳ tuần trước
  toursSold: number; // Tổng từ cột "Đã bán" (sold)
  toursSoldPlanned: number; // Tổng kế hoạch lượt khách
  toursSoldChange: number; // % kế hoạch thay vì -3.2%
  toursSoldPlanPercentage: number; // % so với kế hoạch cho SL Đã Bán
  revenue: string; // Tổng từ cột "Doanh số" (revenue)
  revenuePlanned: string; // Tổng kế hoạch doanh thu
  revenueChange: number; // % kế hoạch cho Doanh số
  revenuePlanPercentage: number; // % so với kế hoạch cho Doanh số
  completionRate: number;
};

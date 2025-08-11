import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard metrics
  app.get("/api/dashboard/metrics", async (_req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard metrics" });
    }
  });

  // Tours
  app.get("/api/tours", async (_req, res) => {
    try {
      const tours = await storage.getTours();
      res.json(tours);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tours" });
    }
  });

  app.get("/api/tours/category/:category", async (req, res) => {
    try {
      const tours = await storage.getToursByCategory(req.params.category);
      res.json(tours);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tours by category" });
    }
  });

  app.get("/api/tours/area/:areaCode", async (req, res) => {
    try {
      const tours = await storage.getToursByArea(req.params.areaCode);
      res.json(tours);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tours by area" });
    }
  });

  app.get("/api/tours/sales-unit/:salesUnitCode", async (req, res) => {
    try {
      const tours = await storage.getToursBySalesUnit(req.params.salesUnitCode);
      res.json(tours);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tours by sales unit" });
    }
  });

  // Hierarchy Levels
  app.get("/api/hierarchy-levels", async (_req, res) => {
    try {
      const levels = await storage.getHierarchyLevels();
      res.json(levels);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hierarchy levels" });
    }
  });

  app.get("/api/hierarchy-levels/category/:category", async (req, res) => {
    try {
      const levels = await storage.getHierarchyLevelsByCategory(req.params.category);
      res.json(levels);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hierarchy levels by category" });
    }
  });

  app.get("/api/hierarchy-levels/level/:level", async (req, res) => {
    try {
      const levels = await storage.getHierarchyLevelsByLevel(req.params.level);
      res.json(levels);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hierarchy levels by level" });
    }
  });

  // Sales Units
  app.get("/api/sales-units", async (_req, res) => {
    try {
      const units = await storage.getSalesUnits();
      res.json(units);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sales units" });
    }
  });

  // Activities
  app.get("/api/activities", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getRecentActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent activities" });
    }
  });

  // Regional Performance
  app.get("/api/regional-performance", async (_req, res) => {
    try {
      const performance = await storage.getRegionalPerformance();
      res.json(performance);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch regional performance" });
    }
  });

  // Simulate real-time updates
  app.post("/api/tours/:id/update-bookings", async (req, res) => {
    try {
      const tourId = req.params.id;
      const { newBookings } = req.body;
      
      const tour = await storage.updateTour(tourId, {
        recentlyBooked: newBookings,
        sold: (await storage.getTours()).find(t => t.id === tourId)?.sold + newBookings || 0
      });
      
      if (!tour) {
        return res.status(404).json({ error: "Tour not found" });
      }
      
      res.json(tour);
    } catch (error) {
      res.status(500).json({ error: "Failed to update tour bookings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentSchema, insertGalleryItemSchema, insertSlideSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import "./types";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|webm|ogg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Simple hardcoded admin check
      if (username === "Riikyy" && password === "290829") {
        req.session.isAdmin = true;
        res.json({ success: true, isAdmin: true });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Logout failed" });
      } else {
        res.json({ success: true });
      }
    });
  });

  app.get("/api/auth/status", async (req, res) => {
    res.json({ isAdmin: !!req.session.isAdmin });
  });

  // Student endpoints
  app.get("/api/students", async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  app.get("/api/students/:id", async (req, res) => {
    try {
      const student = await storage.getStudent(req.params.id);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch student" });
    }
  });

  app.get("/api/students/seat/:seatNumber", async (req, res) => {
    try {
      const seatNumber = parseInt(req.params.seatNumber);
      const student = await storage.getStudentBySeat(seatNumber);
      if (!student) {
        return res.status(404).json({ message: "Student not found for this seat" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch student" });
    }
  });

  app.post("/api/students", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    try {
      const validatedData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(validatedData);
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ message: "Invalid student data" });
    }
  });

  app.put("/api/students/:id", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    try {
      const student = await storage.updateStudent(req.params.id, req.body);
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: "Failed to update student" });
    }
  });

  app.delete("/api/students/:id", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    try {
      await storage.deleteStudent(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete student" });
    }
  });

  // Gallery endpoints
  app.get("/api/gallery", async (req, res) => {
    try {
      const items = await storage.getAllGalleryItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gallery items" });
    }
  });

  app.post("/api/gallery", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    try {
      const validatedData = insertGalleryItemSchema.parse(req.body);
      const item = await storage.createGalleryItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid gallery item data" });
    }
  });

  app.post("/api/gallery/upload", upload.single('file'), async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { title, description } = req.body;
      const mediaType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
      const mediaUrl = `/uploads/${req.file.filename}`;

      const item = await storage.createGalleryItem({
        title,
        description,
        mediaUrl,
        mediaType
      });

      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to upload media" });
    }
  });

  app.delete("/api/gallery/:id", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    try {
      await storage.deleteGalleryItem(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete gallery item" });
    }
  });

  // Slide endpoints
  app.get("/api/slides", async (req, res) => {
    try {
      const slides = await storage.getAllSlides();
      res.json(slides);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch slides" });
    }
  });

  app.post("/api/slides", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    try {
      const validatedData = insertSlideSchema.parse(req.body);
      const slide = await storage.createSlide(validatedData);
      res.status(201).json(slide);
    } catch (error) {
      res.status(400).json({ message: "Invalid slide data" });
    }
  });

  app.put("/api/slides/:id", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    try {
      const slide = await storage.updateSlide(req.params.id, req.body);
      res.json(slide);
    } catch (error) {
      res.status(500).json({ message: "Failed to update slide" });
    }
  });

  app.delete("/api/slides/:id", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    try {
      await storage.deleteSlide(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete slide" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  const httpServer = createServer(app);
  return httpServer;
}

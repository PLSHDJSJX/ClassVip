import { 
  users, students, galleryItems, slides,
  type User, type InsertUser, 
  type Student, type InsertStudent,
  type GalleryItem, type InsertGalleryItem,
  type Slide, type InsertSlide
} from "@shared/schema";
import { db } from "./db";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Student methods
  getAllStudents(): Promise<Student[]>;
  getStudent(id: string): Promise<Student | undefined>;
  getStudentBySeat(seatNumber: number): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, student: Partial<InsertStudent>): Promise<Student>;
  deleteStudent(id: string): Promise<void>;

  // Gallery methods
  getAllGalleryItems(): Promise<GalleryItem[]>;
  getGalleryItem(id: string): Promise<GalleryItem | undefined>;
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;
  deleteGalleryItem(id: string): Promise<void>;

  // Slide methods
  getAllSlides(): Promise<Slide[]>;
  getSlide(id: string): Promise<Slide | undefined>;
  createSlide(slide: InsertSlide): Promise<Slide>;
  updateSlide(id: string, slide: Partial<InsertSlide>): Promise<Slide>;
  deleteSlide(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllStudents(): Promise<Student[]> {
    return db.select().from(students).orderBy(asc(students.seatNumber));
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student || undefined;
  }

  async getStudentBySeat(seatNumber: number): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.seatNumber, seatNumber));
    return student || undefined;
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const [student] = await db.insert(students).values({
      ...insertStudent,
      updatedAt: new Date()
    }).returning();
    return student;
  }

  async updateStudent(id: string, updateStudent: Partial<InsertStudent>): Promise<Student> {
    const [student] = await db.update(students)
      .set({ ...updateStudent, updatedAt: new Date() })
      .where(eq(students.id, id))
      .returning();
    return student;
  }

  async deleteStudent(id: string): Promise<void> {
    await db.delete(students).where(eq(students.id, id));
  }

  async getAllGalleryItems(): Promise<GalleryItem[]> {
    return db.select().from(galleryItems).orderBy(asc(galleryItems.createdAt));
  }

  async getGalleryItem(id: string): Promise<GalleryItem | undefined> {
    const [item] = await db.select().from(galleryItems).where(eq(galleryItems.id, id));
    return item || undefined;
  }

  async createGalleryItem(insertItem: InsertGalleryItem): Promise<GalleryItem> {
    const [item] = await db.insert(galleryItems).values(insertItem).returning();
    return item;
  }

  async deleteGalleryItem(id: string): Promise<void> {
    await db.delete(galleryItems).where(eq(galleryItems.id, id));
  }

  async getAllSlides(): Promise<Slide[]> {
    return db.select().from(slides).orderBy(asc(slides.order));
  }

  async getSlide(id: string): Promise<Slide | undefined> {
    const [slide] = await db.select().from(slides).where(eq(slides.id, id));
    return slide || undefined;
  }

  async createSlide(insertSlide: InsertSlide): Promise<Slide> {
    const [slide] = await db.insert(slides).values(insertSlide).returning();
    return slide;
  }

  async updateSlide(id: string, updateSlide: Partial<InsertSlide>): Promise<Slide> {
    const [slide] = await db.update(slides)
      .set(updateSlide)
      .where(eq(slides.id, id))
      .returning();
    return slide;
  }

  async deleteSlide(id: string): Promise<void> {
    await db.delete(slides).where(eq(slides.id, id));
  }
}

export const storage = new DatabaseStorage();

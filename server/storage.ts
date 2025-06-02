import {
  users,
  contentSections,
  galleryItems,
  siteSettings,
  type User,
  type UpsertUser,
  type ContentSection,
  type InsertContentSection,
  type GalleryItem,
  type InsertGalleryItem,
  type SiteSettings,
  type InsertSiteSettings,
} from "../shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Content operations
  getContentSections(): Promise<ContentSection[]>;
  getContentSection(sectionName: string): Promise<ContentSection | undefined>;
  updateContentSection(sectionName: string, data: Partial<InsertContentSection>): Promise<ContentSection>;
  
  // Gallery operations
  getGalleryItems(): Promise<GalleryItem[]>;
  addGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;
  updateGalleryItem(id: number, data: Partial<InsertGalleryItem>): Promise<GalleryItem>;
  deleteGalleryItem(id: number): Promise<void>;
  
  // Settings operations
  getSiteSettings(): Promise<SiteSettings | undefined>;
  updateSiteSettings(data: Partial<InsertSiteSettings>): Promise<SiteSettings>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Content operations
  async getContentSections(): Promise<ContentSection[]> {
    return await db.select().from(contentSections).where(eq(contentSections.isActive, true));
  }

  async getContentSection(sectionName: string): Promise<ContentSection | undefined> {
    const [section] = await db
      .select()
      .from(contentSections)
      .where(eq(contentSections.sectionName, sectionName));
    return section;
  }

  async updateContentSection(sectionName: string, data: Partial<InsertContentSection>): Promise<ContentSection> {
    const [section] = await db
      .insert(contentSections)
      .values({ sectionName, ...data })
      .onConflictDoUpdate({
        target: contentSections.sectionName,
        set: {
          ...data,
          updatedAt: new Date(),
        },
      })
      .returning();
    return section;
  }

  // Gallery operations
  async getGalleryItems(): Promise<GalleryItem[]> {
    return await db
      .select()
      .from(galleryItems)
      .where(eq(galleryItems.isActive, true))
      .orderBy(galleryItems.sortOrder);
  }

  async addGalleryItem(item: InsertGalleryItem): Promise<GalleryItem> {
    const [newItem] = await db.insert(galleryItems).values(item).returning();
    return newItem;
  }

  async updateGalleryItem(id: number, data: Partial<InsertGalleryItem>): Promise<GalleryItem> {
    const [item] = await db
      .update(galleryItems)
      .set(data)
      .where(eq(galleryItems.id, id))
      .returning();
    return item;
  }

  async deleteGalleryItem(id: number): Promise<void> {
    await db.update(galleryItems)
      .set({ isActive: false })
      .where(eq(galleryItems.id, id));
  }

  // Settings operations
  async getSiteSettings(): Promise<SiteSettings | undefined> {
    const [settings] = await db.select().from(siteSettings).limit(1);
    return settings;
  }

  async updateSiteSettings(data: Partial<InsertSiteSettings>): Promise<SiteSettings> {
    const existing = await this.getSiteSettings();
    
    if (existing) {
      const [settings] = await db
        .update(siteSettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(siteSettings.id, existing.id))
        .returning();
      return settings;
    } else {
      const [settings] = await db.insert(siteSettings).values(data).returning();
      return settings;
    }
  }
}

export const storage = new DatabaseStorage();
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
} from "drizzle-orm/pg-core";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Admin users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Website content sections
export const contentSections = pgTable("content_sections", {
  id: serial("id").primaryKey(),
  sectionName: varchar("section_name", { length: 100 }).notNull().unique(),
  title: text("title"),
  subtitle: text("subtitle"),
  description: text("description"),
  buttonText: varchar("button_text", { length: 100 }),
  buttonLink: varchar("button_link", { length: 255 }),
  backgroundImage: varchar("background_image", { length: 255 }),
  textColor: varchar("text_color", { length: 7 }),
  backgroundColor: varchar("background_color", { length: 7 }),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Gallery/portfolio items
export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  category: varchar("category", { length: 50 }),
  projectUrl: varchar("project_url", { length: 500 }),
  isActive: boolean("is_active").default(true),
  sortOrder: serial("sort_order"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Website settings
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteName: varchar("site_name", { length: 100 }),
  logo: varchar("logo", { length: 255 }),
  primaryColor: varchar("primary_color", { length: 7 }),
  secondaryColor: varchar("secondary_color", { length: 7 }),
  contactEmail: varchar("contact_email", { length: 100 }),
  contactPhone: varchar("contact_phone", { length: 20 }),
  whatsappNumber: varchar("whatsapp_number", { length: 20 }),
  socialLinks: jsonb("social_links"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type ContentSection = typeof contentSections.$inferSelect;
export type InsertContentSection = typeof contentSections.$inferInsert;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type InsertGalleryItem = typeof galleryItems.$inferInsert;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = typeof siteSettings.$inferInsert;
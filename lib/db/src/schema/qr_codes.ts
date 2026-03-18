import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const qrCodesTable = pgTable("qr_codes", {
  comboId: integer("combo_id").primaryKey(),
  imageUrl: text("image_url"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type QrCode = typeof qrCodesTable.$inferSelect;

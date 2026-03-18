import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db, ordersTable, qrCodesTable } from "@workspace/db";
import { eq, or, ilike, sql } from "drizzle-orm";
import { orderToResponse } from "./orders";

const router: IRouter = Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "almehandi2024";

const sessions = new Set<string>();

function generateSessionId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.headers["x-session-id"] as string;
  if (!sessionId || !sessions.has(sessionId)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const sessionId = generateSessionId();
    sessions.add(sessionId);
    res.json({ success: true, message: "Login successful", sessionId });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

router.post("/logout", (req, res) => {
  const sessionId = req.headers["x-session-id"] as string;
  if (sessionId) sessions.delete(sessionId);
  res.json({ success: true, message: "Logged out" });
});

router.get("/orders", requireAuth, async (req, res) => {
  try {
    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;

    let query = db.select().from(ordersTable);

    const conditions = [];
    if (search) {
      conditions.push(
        or(
          ilike(ordersTable.fullName, `%${search}%`),
          ilike(ordersTable.phone, `%${search}%`),
          ilike(ordersTable.whatsapp, `%${search}%`)
        )!
      );
    }
    if (status) {
      conditions.push(eq(ordersTable.status, status));
    }

    let orders;
    if (conditions.length > 0) {
      const whereClause = conditions.length === 1 ? conditions[0] : sql`${conditions[0]} AND ${conditions[1]}`;
      orders = await query.where(whereClause).orderBy(sql`${ordersTable.createdAt} DESC`);
    } else {
      orders = await query.orderBy(sql`${ordersTable.createdAt} DESC`);
    }

    res.json(orders.map(orderToResponse));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/orders/:orderId/status", requireAuth, async (req, res) => {
  try {
    const orderId = Number(req.params.orderId);
    const { status } = req.body;
    const validStatuses = ["pending_verification", "payment_verified", "order_confirmed", "cancelled"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }
    const [order] = await db.update(ordersTable)
      .set({ status })
      .where(eq(ordersTable.id, orderId))
      .returning();
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(orderToResponse(order));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/orders/export", requireAuth, async (req, res) => {
  try {
    const orders = await db.select().from(ordersTable).orderBy(sql`${ordersTable.createdAt} DESC`);
    const headers = ["Order ID", "Combo Name", "Price", "Full Name", "Phone", "WhatsApp", "Address", "City", "State", "Pincode", "Notes", "Status", "Screenshot URL", "Created At"];
    const rows = orders.map(o => [
      o.id, o.comboName, o.price, o.fullName, o.phone, o.whatsapp,
      `"${o.address}"`, o.city, o.state, o.pincode,
      `"${o.notes || ""}"`, o.status, o.screenshotUrl || "", o.createdAt.toISOString()
    ].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=orders.csv");
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const qrDir = path.join(process.cwd(), "uploads", "qr");
fs.mkdirSync(qrDir, { recursive: true });

const qrStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, qrDir),
  filename: (req, file, cb) => {
    const comboId = req.params.comboId;
    cb(null, `combo-${comboId}${path.extname(file.originalname)}`);
  },
});
const qrUpload = multer({ storage: qrStorage });

router.post("/qr/:comboId", requireAuth, qrUpload.single("qr"), async (req, res) => {
  try {
    const comboId = Number(req.params.comboId);
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    const imageUrl = `/api/uploads/qr/${req.file.filename}`;

    const existing = await db.select().from(qrCodesTable).where(eq(qrCodesTable.comboId, comboId));
    if (existing.length > 0) {
      await db.update(qrCodesTable).set({ imageUrl, updatedAt: new Date() }).where(eq(qrCodesTable.comboId, comboId));
    } else {
      await db.insert(qrCodesTable).values({ comboId, imageUrl });
    }
    res.json({ comboId, imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

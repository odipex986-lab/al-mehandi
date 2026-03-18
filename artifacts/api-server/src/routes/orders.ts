import { Router, type IRouter } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db, ordersTable } from "@workspace/db";
import { eq, or, ilike } from "drizzle-orm";

const router: IRouter = Router();

const uploadsDir = path.join(process.cwd(), "uploads", "screenshots");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

function orderToResponse(order: typeof ordersTable.$inferSelect) {
  return {
    id: order.id,
    comboId: order.comboId,
    comboName: order.comboName,
    price: Number(order.price),
    fullName: order.fullName,
    phone: order.phone,
    whatsapp: order.whatsapp,
    address: order.address,
    city: order.city,
    state: order.state,
    pincode: order.pincode,
    notes: order.notes ?? undefined,
    status: order.status,
    screenshotUrl: order.screenshotUrl ?? undefined,
    createdAt: order.createdAt.toISOString(),
  };
}

router.post("/", async (req, res) => {
  try {
    const { comboId, comboName, price, fullName, phone, whatsapp, address, city, state, pincode, notes } = req.body;
    if (!comboId || !comboName || !price || !fullName || !phone || !whatsapp || !address || !city || !state || !pincode) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    const [order] = await db.insert(ordersTable).values({
      comboId: Number(comboId),
      comboName,
      price: String(price),
      fullName,
      phone,
      whatsapp,
      address,
      city,
      state,
      pincode,
      notes: notes || null,
    }).returning();
    res.status(201).json(orderToResponse(order));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:orderId/payment-screenshot", upload.single("screenshot"), async (req, res) => {
  try {
    const orderId = Number(req.params.orderId);
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    const screenshotUrl = `/api/uploads/screenshots/${req.file.filename}`;
    const [order] = await db.update(ordersTable)
      .set({ screenshotUrl })
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

export { orderToResponse };
export default router;

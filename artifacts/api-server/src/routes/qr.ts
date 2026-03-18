import { Router, type IRouter } from "express";
import { db, qrCodesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/:comboId", async (req, res) => {
  try {
    const comboId = Number(req.params.comboId);
    const [qr] = await db.select().from(qrCodesTable).where(eq(qrCodesTable.comboId, comboId));
    if (qr) {
      res.json({ comboId: qr.comboId, imageUrl: qr.imageUrl });
    } else {
      res.json({ comboId, imageUrl: null });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

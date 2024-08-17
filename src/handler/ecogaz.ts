import { Hono } from "hono";
import { desc, gte } from "drizzle-orm";
import EcogazSignalModel, { ecogazSignal } from "../schema/ecogazSignal";

const app = new Hono<{ Bindings: Bindings }>();

app.get('/signals', async (c) => {
  const { startTime, limit } = c.req.query();
  const model = new EcogazSignalModel(c.env.DB);

  const signals = await model.select()
    .where(
      gte(ecogazSignal.timestamp, startTime ? parseInt(startTime) : 0)
    )
    .limit(limit ? parseInt(limit) : 10)
    .orderBy(desc(ecogazSignal.timestamp));
  
  return c.json(signals);
});

export default app;

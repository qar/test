import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { desc, eq } from "drizzle-orm";
import BoostModeDurationModel, { boostModeDuration } from "../schema/boostModeDuration";

const app = new Hono<{ Bindings: Bindings }>();

const schema = z.object({
  duration: z.number().gt(0),
  devId: z.string(),
  createdAt: z.number().optional(),
});

app.get('/:devId', async (c) => {
  const devId = c.req.param('devId');
  const model = new BoostModeDurationModel(c.env.DB);

  const data = await model.select().where(eq(boostModeDuration.devId, devId)).orderBy(desc(boostModeDuration.createdAt)).get();

  if (!data) {
    return c.notFound();
  }

  return c.json({
    duration: data.duration,
    createdAt: data.createdAt,
  });
});

app.post('/', zValidator('json', schema), async (c) => {
  const data = c.req.valid('json');
  const model = new BoostModeDurationModel(c.env.DB);

  const boost = await model.insert({
    duration: data.duration,
    devId: data.devId,
    createdAt: data.createdAt || Date.now(),
  });
  
  return c.json(boost, 201);
});

export default app;

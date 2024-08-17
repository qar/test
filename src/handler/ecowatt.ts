import { Hono } from 'hono';
import { desc, gte } from 'drizzle-orm';
import EcoWattSignalModel, { ecowattSignal } from '../schema/ecowattSignal';

const app = new Hono<{ Bindings: Bindings }>();

// Legacy routes
app.get('/', async (c) => {
  const { startTime, limit } = c.req.query();
  const model = new EcoWattSignalModel(c.env.DB);

  const signals = await model.select()
    .where(
      gte(ecowattSignal.timestamp, startTime ? parseInt(startTime) : 0)
    )
    .limit(limit ? parseInt(limit) : 10)
    .orderBy(desc(ecowattSignal.timestamp));

  return c.json(signals.map((signal) => {
    return {
      ...signal,
      values: JSON.parse(signal.values)
    };
  }));
});

app.get('/signals', async (c) => {
  const { startTime, limit } = c.req.query();
  const model = new EcoWattSignalModel(c.env.DB);

  const signals = await model.select()
    .where(
      gte(ecowattSignal.timestamp, startTime ? parseInt(startTime) : 0)
    )
    .limit(limit ? parseInt(limit) : 10)
    .orderBy(desc(ecowattSignal.timestamp));

  return c.json(signals.map((signal) => {
    return {
      ...signal,
      values: JSON.parse(signal.values)
    };
  }));
});

export default app;

import { Hono } from "hono";
import { md5 } from "hono/utils/crypto";

const app = new Hono<{ Bindings: Bindings }>();

app.use(async (c, next) => {
  const pathSegments = c.req.url.split('/');
  const deviceId = pathSegments[pathSegments.length - 1];
  const requestId = c.req.header('X-Request-ID');
  
  if (!requestId) {
    return c.json({ error: 'Request ID is required' }, 401);
  }

  const now = new Date().getMinutes();

  const hashRequstId = await md5(`${deviceId}${now}`);

  if (hashRequstId !== requestId) {
    return c.json({ error: 'Invalid Request ID' }, 401);
  }
  
  await next();
});

app.get('/:devId', async (c) => {
  const devId = c.req.param('devId');

  const data = await c.env.APP_FEATURES_STORE.get(devId, { type: 'json' });

  if (!data) {
    return c.notFound();
  }

  return c.json(data);
});

app.put('/:devId', async (c) => {
  const devId = c.req.param('devId');
  const data = await c.req.json();

  await c.env.APP_FEATURES_STORE.put(devId, JSON.stringify(data));

  return c.json({}, 200);
});

app.patch('/:devId', async (c) => {
  const devId = c.req.param('devId');
  const data = await c.req.json();

  const existingData = await c.env.APP_FEATURES_STORE.get(devId, { type: 'json' });

  if (!existingData) {
    await c.env.APP_FEATURES_STORE.put(devId, JSON.stringify(data));
    return c.json(data, 201);
  }

  const newData = { ...existingData, ...data };

  await c.env.APP_FEATURES_STORE.put(devId, JSON.stringify(newData));

  return c.json(newData, 200);
});

export default app;

import { Hono } from "hono";
import deviceAuth from "../middleware/deviceAuth";
import { WeatherService } from "../services/weather";
import { ResponseUtil } from "../lib/utils/response";

const app = new Hono<{ Bindings: Bindings }>();

app.use(deviceAuth);

/**
  * 当前天气
  */
app.get('/current', async (c) => {
  const weatherService = new WeatherService(c.env.VISUAL_CROSSING_API_KEY);
  const location = c.req.query('location');
  const units = c.req.query('units') || 'metric';

  if (!location) {
    return c.json({ error: 'Missing required field: location' }, 400);
  }

  try {
    const result = await weatherService.getCurrentWeather(location, units);

    return ResponseUtil.success(c, { ...result });
  } catch (error) {
    console.error(error);
    return ResponseUtil.error(c, 'Failed to retrieve weather data', 500);
  }
});

app.get('/forecast', async (c) => {
  const weatherService = new WeatherService(c.env.VISUAL_CROSSING_API_KEY);
  const location = c.req.query('location');
  const units = c.req.query('units') || 'metric';
  const days = parseInt(c.req.query('days') || '15', 10);

  if (!location) {
    return c.json({ message: 'Missing required field: location' }, 400);
  }

  try {
    const result = await weatherService.getForecast(location, days, units);
    return ResponseUtil.success(c, { ...result });
  } catch (error) {
    console.error(error);
    return ResponseUtil.error(c, 'Failed to retrieve weather data', 500);
  }
});

app.get('/:date', async (c) => {
  const weatherService = new WeatherService(c.env.VISUAL_CROSSING_API_KEY);
  const location = c.req.query('location');
  const units = c.req.query('units') || 'metric';
  const date = c.req.param('date');

  if (!location) {
    return ResponseUtil.missingField(c, 'location');
  }

  try {
    const result = await weatherService.getWeatherByDate(location, date, units);
    return ResponseUtil.success(c, { ...result });
  } catch (error) {
    return ResponseUtil.error(c, 'Failed to retrieve weather data', 500);
  }
});

export default app;

import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';

import EcoWatt from './handler/ecowatt';
import Ecogaz from './handler/ecogaz';
import AppFeatures from './handler/appFeatures';
import EcoWattSignalModel from './schema/ecowattSignal';
import EcogazSignalModel from './schema/ecogazSignal';
import Weather from './handler/weather';
import { fetchEcowattSignals } from './scheduled/ecowatt';
import { fetchEcogazSignals } from './scheduled/ecogaz';

const app = new Hono<{ Bindings: Bindings }>();

app.use(logger());
app.use(cors());
app.use(prettyJSON());

app.get('/', (c) => {
  return c.json({ message: 'Hello, World!' });
});

// Legacy routes
app.route('/ecowatt', EcoWatt);

const v1 = new Hono().basePath('/v1');

v1.route('/ecowatt', EcoWatt);
v1.route('/ecogaz', Ecogaz);
v1.route('/appFeatures', AppFeatures);
v1.route('/weather', Weather);

app.route('/', v1);

const scheduled: ExportedHandlerScheduledHandler<Bindings> = async (event, env, ctx) => {
  const ecoWattSignalModel = new EcoWattSignalModel(env.DB);
  const ecogazSignalModel = new EcogazSignalModel(env.DB);

  switch (event.cron) {
    // Fetch EcoWatt signals at UTC 3:00 AM and 4:00 AM
    case '5 15,16 * * *':
      await fetchEcowattSignals(ecoWattSignalModel);
      break;
    // Fetch Ecogaz signals at UTC 8:00 AM and 9:00 AM
    case '5 8,9 * * *':
      await fetchEcogazSignals(ecogazSignalModel);
      break;
    default:
      break;
  }
};

export default {
  fetch: app.fetch,
  scheduled: scheduled,
};

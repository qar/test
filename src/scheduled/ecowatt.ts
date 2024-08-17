import EcoWattService from "../lib/EcoWattService";
import { eq } from "drizzle-orm";
import EcoWattSignalModel, { ecowattSignal } from "../schema/ecowattSignal";

export const fetchEcowattSignals = async (model: EcoWattSignalModel) => {
  const ecowattService = new EcoWattService();
  const { access_token, token_type } = await ecowattService.getToken();
  const { signals } = await ecowattService.getSignals(access_token, token_type);

  await Promise.all(signals.map(async (signal) => {
    const timestamp = new Date(signal.jour).getTime();
    const existing = await model.select().where(eq(ecowattSignal.timestamp, timestamp)).get();

    if (existing) {
      await model.updateById(existing.id, {
        dvalue: signal.dvalue,
        values: JSON.stringify(signal.values),
      });
      return;
    }

    await model.insert({
      timestamp,
      dvalue: signal.dvalue,
      values: JSON.stringify(signal.values),
    });
  }));
};

import { eq } from 'drizzle-orm';
import EcogazService from '../lib/EcogazService';
import EcogazSignalModel, { ecogazSignal } from '../schema/ecogazSignal';

export const fetchEcogazSignals = async (model: EcogazSignalModel) => {
  const ecogazService = new EcogazService();

  const handlers = [
    new Date().toISOString().split('T')[0],
    new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  ].map(async (date) => {
    const signal = await ecogazService.getSignalByDate(date);
    const timestamp = new Date(signal.gas_day).getTime();

    const existing = await model.select().where(eq(ecogazSignal.timestamp, timestamp)).get();

    if (existing) {
      await model.updateById(existing.id, {
        timestamp,
        color: signal.color,
        couleur_du_signal_fr: signal.couleur_du_signal_fr,
        indice_de_couleur: signal.indice_de_couleur,
      });
      return;
    }

    await model.insert({
      timestamp,
      color: signal.color,
      couleur_du_signal_fr: signal.couleur_du_signal_fr,
      indice_de_couleur: signal.indice_de_couleur,
    });
  });

  await Promise.all(handlers);
};

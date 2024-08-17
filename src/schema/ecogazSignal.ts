import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import ModelHelper from '../lib/helper/ModelHelper';

export const ecogazSignal = sqliteTable('ecogazSignals', {
  id: integer('id').primaryKey(),
  timestamp: integer('timestamp').notNull(),
  color: text('color').notNull(),
  couleur_du_signal_fr: text('couleur_du_signal_fr').notNull(),
  indice_de_couleur: text('indice_de_couleur').notNull(),
});

export default class EcogazSignalModel extends ModelHelper<typeof ecogazSignal> {
  constructor(db: D1Database) {
    super(db, ecogazSignal);
  }
}

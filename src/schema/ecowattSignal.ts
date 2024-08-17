import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import ModelHelper from '../lib/helper/ModelHelper';

export const ecowattSignal = sqliteTable('ecowattSignals', {
  id: integer('id').primaryKey(),
  timestamp: integer('timestamp').notNull(),
  dvalue: integer('dvalue').notNull(),
  values: text('values').notNull(),
});

export default class EcoWattSignalModel extends ModelHelper<typeof ecowattSignal> {
  constructor(db: D1Database) {
    super(db, ecowattSignal);
  }
}

import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import ModelHelper from '../lib/helper/ModelHelper';

export const boostModeDuration = sqliteTable('boostModeDurations', {
  id: integer('id').primaryKey(),
  duration: integer('duration').notNull(),
  createdAt: integer('createdAt').notNull(),
  devId: text('devId').notNull(),
});

export default class BoostModeDurationModel extends ModelHelper<typeof boostModeDuration> {
  constructor(db: D1Database) {
    super(db, boostModeDuration);
  }
}

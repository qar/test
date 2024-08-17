import { SQL, sql } from "drizzle-orm";
import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { SQLiteTable, SelectedFields } from "drizzle-orm/sqlite-core";

export default class ModelHelper<T extends SQLiteTable> {
  protected readonly db: DrizzleD1Database;
  private readonly table: T;
  
  constructor(db: D1Database, table: T) {
    this.db = drizzle(db);
    this.table = table;
  }

  select() {
    return this.db.select().from(this.table);
  }
  
  selectWithFields<TSelection extends SelectedFields>(fields: TSelection) {
    return this.db.select(fields).from(this.table);
  }

  selectDistinct<TSelection extends SelectedFields>(fields: TSelection) {
    return this.db.selectDistinct(fields).from(this.table);
  }

  count(where?: SQL) {
    return this.db.select({ count: sql<number>`count(*)` }).from(this.table).where(where);
  }

  insert(data: T["$inferInsert"]) {
    return this.db.insert(this.table).values(data).returning().get();
  }

  delete() {
    return this.db.delete(this.table);
  }

  deleteById(id: number) {
    return this.delete().where(sql`id = ${id}`);
  }

  update() {
    return this.db.update(this.table);
  }

  updateById(id: number, data: Partial<T["$inferInsert"]>) {
    return this.update().set(data).where(sql`id = ${id}`).returning().get();
  }
}

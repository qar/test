import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";

export class ResponseUtil {
  static success(c: Context, data: any, status: ContentfulStatusCode = 200) {
    return c.json(data, status);
  }

  static error(c: Context, message: string, status: ContentfulStatusCode = 400) {
    return c.json({ error: message }, status);
  }

  static missingField(c: Context, field: string) {
    return this.error(c, `Missing required field: ${field}`, 400);
  }

  static unauthorized(c: Context, message?: string) {
    return this.error(c, message || 'Unauthorized', 401);
  }

  static notFound(c: Context) {
    return this.error(c, 'Not Found', 404);
  }

  static internalError(c: Context, message: string) {
    return this.error(c, message, 500);
  }
}
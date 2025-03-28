import { createMiddleware } from "hono/factory";
import { md5 } from "hono/utils/crypto";
import { ResponseUtil } from "../lib/utils/response";

/**
 * 合法的设备ID，后续需要从数据库中获取
 * h9tjkhgeovlaeelc 浇花器 Wi-Fi
 * df7ti294 浇花器 Zigbee
 */
const DEVICE_IDS = ['h9tjkhgeovlaeelc', 'df7ti294'];

const deviceAuth = createMiddleware(async (c, next) => {
  const deviceId = c.req.header('X-API-ID');
  const timestamp = c.req.header('X-Timestamp');
  const signature = c.req.header('X-Signature');

  if (!deviceId || !timestamp || !signature) {
    return ResponseUtil.unauthorized(c, 'Missing required headers');
  }

  // 检查设备是否合法
  const validDevice = DEVICE_IDS.includes(deviceId);

  if (!validDevice) {
    return ResponseUtil.unauthorized(c, 'Invalid device ID');
  }

  // 检查时间戳是否在允许范围内（5分钟）
  const now = Date.now();
  const timeDiff = now - Number(timestamp);

  if (isNaN(timeDiff) || timeDiff < 0 || timeDiff > 300000) {
    return ResponseUtil.unauthorized(c, 'Request expired or invalid timestamp');
  }

  // 检查签名是否正确
  const expectedSignature = await md5(`${deviceId}${timestamp}`);

  if (signature !== expectedSignature) {
    return ResponseUtil.unauthorized(c, 'Invalid signature');
  }

  await next();
});

export default deviceAuth;

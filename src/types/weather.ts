/**
 * Visual Crossing Weather API 响应数据类型定义
 */

// 天气警报
export interface WeatherAlert {
  event: string;           // 警报事件名称
  headline?: string;       // 警报标题
  description: string;     // 警报详细描述
  onset?: string;          // 警报开始时间
  ends?: string;           // 警报结束时间
  severity?: string;       // 警报严重程度
}

// 小时天气数据
export interface HourWeather {
  datetime: string;        // 时间，格式为 "HH:MM:SS"
  datetimeEpoch: number;   // 时间戳（秒）
  temp: number;            // 温度
  feelslike: number;       // 体感温度
  humidity: number;        // 湿度（百分比）
  dew: number;             // 露点温度
  precip: number;          // 降水量
  precipprob?: number;     // 降水概率（百分比）
  preciptype?: string[] | null; // 降水类型（rain, snow, freezingrain, ice）
  snow?: number;           // 降雪量
  snowdepth?: number;      // 积雪深度
  windgust?: number;       // 阵风风速
  windspeed: number;       // 持续风速
  winddir: number;         // 风向（角度）
  pressure: number;        // 气压（毫巴）
  visibility: number;      // 能见度
  cloudcover: number;      // 云量（百分比）
  solarradiation?: number; // 太阳辐射（W/m2）
  solarenergy?: number;    // 太阳能（MJ/m2）
  uvindex: number;         // 紫外线指数
  conditions: string;      // 天气状况文本描述
  icon: string;            // 天气图标代码
  source?: string;         // 数据来源
  stations?: string[];     // 气象站
  offsetseconds?: number;  // 时区偏移（秒）
}

// 日天气数据
export interface DayWeather {
  datetime: string;        // 日期，格式为 "YYYY-MM-DD"
  datetimeEpoch: number;   // 时间戳（秒）
  tempmax: number;         // 最高温度
  tempmin: number;         // 最低温度
  temp: number;            // 平均温度
  feelslikemax: number;    // 最高体感温度
  feelslikemin: number;    // 最低体感温度
  feelslike: number;       // 平均体感温度
  dew: number;             // 露点温度
  humidity: number;        // 湿度（百分比）
  precip: number;          // 降水量
  precipprob?: number;     // 降水概率（百分比）
  precipcover?: number;    // 降水覆盖率（百分比）
  preciptype?: string[] | null; // 降水类型（rain, snow, freezingrain, ice）
  snow?: number;           // 降雪量
  snowdepth?: number;      // 积雪深度
  windgust?: number;       // 阵风风速
  windspeed: number;       // 持续风速
  windspeedmax?: number;   // 最大风速
  windspeedmean?: number;  // 平均风速
  windspeedmin?: number;   // 最小风速
  winddir: number;         // 风向（角度）
  pressure: number;        // 气压（毫巴）
  cloudcover: number;      // 云量（百分比）
  visibility: number;      // 能见度
  solarradiation?: number; // 太阳辐射（W/m2）
  solarenergy?: number;    // 太阳能（MJ/m2）
  uvindex: number;         // 紫外线指数
  uvindex2?: number;       // 替代紫外线指数（美国国家气象局算法）
  severerisk?: number;     // 恶劣天气风险（0-100）
  sunrise: string;         // 日出时间
  sunriseEpoch: number;    // 日出时间戳（秒）
  sunset: string;          // 日落时间
  sunsetEpoch: number;     // 日落时间戳（秒）
  moonphase: number;       // 月相（0-1）
  moonrise?: string;       // 月出时间
  moonriseEpoch?: number;  // 月出时间戳（秒）
  moonset?: string;        // 月落时间
  moonsetEpoch?: number;   // 月落时间戳（秒）
  conditions: string;      // 天气状况文本描述
  description: string;     // 天气详细描述
  icon: string;            // 天气图标代码
  stations?: Record<string, any>; // 气象站信息
  source?: string;         // 数据来源
  hours?: HourWeather[];   // 小时天气数据
}

// 当前天气状况
export interface CurrentConditions {
  datetime: string;        // 日期时间
  datetimeEpoch: number;   // 时间戳（秒）
  temp: number;            // 温度
  feelslike: number;       // 体感温度
  humidity: number;        // 湿度（百分比）
  dew: number;             // 露点温度
  precip: number;          // 降水量
  precipprob?: number;     // 降水概率（百分比）
  preciptype?: string[] | null; // 降水类型
  snow?: number;           // 降雪量
  snowdepth?: number;      // 积雪深度
  windgust?: number;       // 阵风风速
  windspeed: number;       // 持续风速
  winddir: number;         // 风向（角度）
  pressure: number;        // 气压（毫巴）
  visibility: number;      // 能见度
  cloudcover: number;      // 云量（百分比）
  solarradiation?: number; // 太阳辐射
  solarenergy?: number;    // 太阳能
  uvindex: number;         // 紫外线指数
  conditions: string;      // 天气状况文本描述
  icon: string;            // 天气图标代码
  stations?: string[];     // 气象站
  sunrise?: string;        // 日出时间
  sunriseEpoch?: number;   // 日出时间戳
  sunset?: string;         // 日落时间
  sunsetEpoch?: number;    // 日落时间戳
  moonphase?: number;      // 月相
}

// 天气 API 响应
export interface WeatherResponse {
  queryCost?: number;      // 查询成本
  latitude: number;        // 纬度
  longitude: number;       // 经度
  resolvedAddress: string; // 解析后的地址
  address: string;         // 请求的地址
  timezone: string;        // 时区
  tzoffset: number;        // 时区偏移（小时）
  description?: string;    // 天气概述描述
  days: DayWeather[];      // 天气数据（按天）
  alerts?: WeatherAlert[]; // 天气警报
  currentConditions?: CurrentConditions; // 当前天气状况
  stations?: Record<string, any>; // 气象站信息
}

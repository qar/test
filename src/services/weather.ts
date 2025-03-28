import Fetcher from '../lib/Fetcher';
import { WeatherResponse } from '../types/weather';

const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

export class WeatherService {
  private readonly fetcher: Fetcher;
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.fetcher = new Fetcher({ baseUrl: BASE_URL });
    this.apiKey = apiKey;
  }

  async getCurrentWeather(location: string, units: string = 'metric') {
    const now = new Date();
    const startTime = Math.floor(now.getTime() / 1000);
    const endTime = Math.floor(now.setHours(now.getHours() + 24) / 1000);

    const resp = await this.fetcher.get<WeatherResponse>(`/${location}/${startTime}/${endTime}`, {
      params: {
        key: this.apiKey,
        unitGroup: units
      }
    });

    return resp.data;
  }

  async getForecast(location: string, days: number = 15, units: string = 'metric') {
    const now = new Date();
    const startTime = Math.floor(now.getTime() / 1000);
    const endTime = startTime + ((days - 1) * 24 * 60 * 60);

    const resp = await this.fetcher.get<WeatherResponse>(`/${location}/${startTime}/${endTime}`, {
      params: {
        key: this.apiKey,
        unitGroup: units
      }
    });

    return resp.data;
  }

  async getWeatherByDate(location: string, date: Date | number | string, units: string = 'metric') {
    const targetDate = Math.floor(new Date(date).getTime() / 1000);

    const resp = await this.fetcher.get<WeatherResponse>(`/${location}/${targetDate}`, {
      params: {
        key: this.apiKey,
        unitGroup: units,
      },
    });

    return resp.data;
  }
}

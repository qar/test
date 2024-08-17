import Fetcher from '../Fetcher';

interface Signal {
  GenerationFichier: string;
  jour: string;
  dvalue: number;
  values: { pas: number; hvalue: number }[];
}

export default class EcoWattService {
  private readonly fetcher: Fetcher;

  constructor() {
    this.fetcher = new Fetcher({
      baseUrl: 'https://digital.iservices.rte-france.com'
    });
  }

  async getToken() {
    const resp = await this.fetcher.post<{ access_token: string; token_type: string; expires_in: number }>('/token/oauth', {
      'content-type': 'application/json',
      'Authorization': 'Basic NGQ1MjAxNzEtOTY0MS00OWNhLWJkYTctYmI5Y2QwNTZiZWU5Ojk5NjMwNDJlLTg3ODUtNDE2OS05ZGQ4LWUwMjc2OTEwMTFkZQ=='
    });
    if (resp.status !== 200) {
      throw new Error('Failed to fetch data');
    }
    return resp.data;
  }

  async getSignals(token: string, tokenType: string) {
    const resp = await this.fetcher.get<{
      signals: Signal[]
    }>('/open_api/ecowatt/v5/signals', {
      headers: {
        'content-type': 'application/json',
        'Authorization': `${tokenType} ${token}`
      }
    });
    if (resp.status !== 200) {
      throw new Error('Failed to fetch data');
    }
    return resp.data;
  }
}

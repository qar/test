import Fetcher from '../Fetcher';

interface Signal {
  gas_day: string;
  color: string;
  couleur_du_signal_fr: string;
  indice_de_couleur: string;
}

export default class EcogazService {
  private readonly fetcher: Fetcher; 

  constructor() {
    this.fetcher = new Fetcher({
      baseUrl: 'https://odre.opendatasoft.com/api/explore/v2.1'
    });
  }

  async getSignals(refine: string = '', limit: number = 10, offset: number = 0) {
    const resp = await this.fetcher.get<{ total_count: number, results: Signal[] }>('/catalog/datasets/signal-ecogaz/records', {
      params: {
        refine,
        order_by: 'gas_day asc',
        limit: limit.toString(),
        offset: offset.toString(),
      },
    });

    if (resp.status !== 200) {
      throw new Error('Failed to fetch data');
    }
    
    return resp.data;
  }

  async getSignalByDate(date: string) {
    const data = await this.getSignals(`gas_day:"${date}"`);
    return data.results[0];
  }
}

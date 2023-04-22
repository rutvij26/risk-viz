
const BASE_URL = 'http://localhost:3000'

export interface IRiskData {
    assetName: string;
    lat: number;
    long: number;
    businessCategory: string;
    riskRating: number;
    riskFactors: Record<string, number>;
    year: number;
}

const RiskStore = {
    data: [] as IRiskData[],
    async fetchData () {
        try {
            const response = await fetch(`${BASE_URL}/api/riskData`);
            if (!response.ok) {
              throw new Error('Error fetching risk data');
            }
            const {data} = await response.json();
            this.data = data;
            console.log("Data", data);
          } catch (error) {
            console.error('Error loading data:', error);
          }
    },
    get riskData () {
        return this.data
    },
    async init () {
        await this.fetchData()
    }
}

export default RiskStore;

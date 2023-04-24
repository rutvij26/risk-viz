import { action, computed, makeObservable, observable } from "mobx";

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
	filteredData: [] as IRiskData[],
	// selectedMarker: {} as IRiskData | null,
	decade: 2030,
	decades: [] as number[],
	async fetchData() {
		try {
			const response = await fetch(`${BASE_URL}/api/riskData`);
			if (!response.ok) {
				throw new Error('Error fetching risk data');
			}
			const { data } = await response.json();
			this.data = data;
		} catch (error) {
			console.error('Error loading data:', error);
		}
	},
	get riskData() {
		return this.data
	},

	setDecade(year: number) {
		console.log("New Decade :", year);
		this.decade = year;

	},
	setDecades() {
		this.decades = Array.from(new Set(this.data.map(d => {
			return d.year
		}))).sort()
	},
	setFilteredData() {
		console.log("setting filtered data", this.decade);

		this.filteredData = this.data.filter((d) => d.year >= this.decade && d.year < this.decade + 10);
	},
	async init() {
		await this.fetchData().then(() => this.setDecade(this.decade)).then(() => this.setFilteredData()).then(() => this.setDecades())
	}
}

makeObservable(RiskStore, {
	data: observable,
	filteredData: observable,
	decade: observable,
	fetchData: action,
	riskData: computed,
	decades: observable,
	setDecade: action,
	setDecades: action,
	setFilteredData: action,
	init: action
});

export default RiskStore;

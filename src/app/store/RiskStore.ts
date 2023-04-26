import { action, computed, makeObservable, observable } from "mobx";
import _ from 'lodash';

const BASE_URL = 'https://risk-viz-one.vercel.app';
const NONE_STRING = "None";

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
	decade: 2030 as number,
	selectedBusinessCategory: null as unknown as string,
	selectedAssetName: null as unknown as string,
	selectedLatLong: null as unknown as string,
	
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
	get filteredMapData() {
		return this.latLongs.length > 0 
		? this.latLongs.map((l) => {
			const lat = parseFloat(l.split(",")[0])
			const long = parseFloat(l.split(",")[1])
			if (lat && long) {
			console.log(lat, long, "lat", "long");
				
				return {
					assetNames : this.assetNamesForSpecificLatLong(lat, long),
					businessCategories : this.businessCategoriesForSpecificLatLong(lat, long),
					averageRiskRating : this.averageRiskRatingForSpecificLatLong(lat, long),
					averageRiskFactors : this.averageRiskFactorsForSpecificLatLong(lat, long),
					year: this.decade,
					lat: lat,
					long: long
				}
			}
		})
		: []
	},
	assetNamesForSpecificLatLong(lat: number, long: number) {
		return Array.from(new Set(this.data.filter((d) =>d.year >= this.decade && d.year < this.decade +10 && d.lat === lat && d.long === long).map((d) => d.assetName)))
	},
	businessCategoriesForSpecificLatLong(lat: number, long: number) {
		return Array.from(new Set(this.data.filter((d) =>d.year >= this.decade && d.year < this.decade +10 && d.lat === lat && d.long === long).map((d) => d.businessCategory)))
	},
	averageRiskRatingForSpecificLatLong(lat: number, long: number) {
		const bufferData = this.data.filter((d) =>d.year >= this.decade && d.year < this.decade +10 && d.lat === lat && d.long === long)

		if (bufferData.length === 0) {
			return 0
		}
		const sum = bufferData.reduce((acc, item) => acc + item.riskRating, 0);
		return sum / bufferData.length;

	},
	averageRiskFactorsForSpecificLatLong(lat: number, long: number) {
		const filtered = this.data.filter((item) => item.year >= this.decade && item.year < this.decade +10 && item.lat === lat && item.long === long);
		const result:  Record<string, { sum: number, count: number }> = {};

		filtered.forEach((item) => {
			const { riskFactors } = item;
			Object.entries(riskFactors).forEach(([factor, value]) => {
				if (!result[factor]) {
					result[factor] = {
						sum: 0,
						count: 0,
					};
				}
				result[factor].sum += value;
				result[factor].count += 1;
			});
		});

		const averageResult: Record<string, number> = {};
		Object.entries(result).forEach(([factor, { sum, count }]) => {
			averageResult[factor] = sum / count;
		});

		return averageResult;

	},
	setDecade(year: number) {
		this.decade = year;
	},
	setAssetName(name: string) {
		this.selectedAssetName = name;
	},
	setBusinessCategory(category: string) {
		this.selectedBusinessCategory = category;
	},
	setLatLong(latLongString: string) {
		this.selectedLatLong = latLongString;
	},
	get decades() {
		return Array.from(new Set(this.data.map(d => {
			return d.year
		}))).sort()
	},
	get riskKeys() {
		return this.data && this.data.length > 0
			? Object.keys(this.data.reduce((acc, obj) => {
				const numKeys = Object.keys(obj.riskFactors).length;
				if (numKeys > Object.keys(acc.riskFactors).length) {
					return obj;
				}
				return acc;
			}).riskFactors)
			: [];
	},
	get businessCategories() {
		return [NONE_STRING, ...Array.from(new Set(this.data.map(d => {
			return d.businessCategory
		}))).sort()]
	},
	get assetNames() {
		return [NONE_STRING, ...Array.from(new Set(this.data.map(d => {
			return d.assetName
		}))).sort()]
	},
	get latLongs() {
		return [NONE_STRING, ...Array.from(new Set(this.data.map(d => {
			return d.lat.toString() + "," + d.long.toString();
		}))).sort()]
	},
	get tableData() {
		return this.data.filter((d) => d.year === this.decade);
	},
	get filteredChartData() {
		return this.data.filter((d) => {
			if (this.selectedAssetName && this.selectedAssetName !== NONE_STRING && this.selectedAssetName !== d.assetName) {
				return false
			}
			if (this.selectedBusinessCategory && this.selectedBusinessCategory !== NONE_STRING && this.selectedBusinessCategory !== d.businessCategory) {
				return false
			}
			if (this.selectedLatLong && this.selectedLatLong !== NONE_STRING && this.selectedLatLong !== this.latLongStringParser(d.lat, d.long)) {
				return false
			}
			return true
		})
	},
	latLongStringParser(lat: number, long: number) {
		const parsed = lat.toString() + "," + long.toString();
		return parsed;
	},
	async init() {
		await this.fetchData()
			.then(() => this.setDecade(this.decades[1]))
			.then(() => {
				this.selectedAssetName = this.assetNames[1]
			})
	}
}

makeObservable(RiskStore, {
	data: observable,
	decade: observable,
	fetchData: action,
	riskData: computed,
	riskKeys: computed,
	selectedBusinessCategory: observable,
	selectedAssetName: observable,
	selectedLatLong: observable,
	setDecade: action,
	averageRiskFactorsForSpecificLatLong: action,
	averageRiskRatingForSpecificLatLong: action,
	assetNamesForSpecificLatLong: action,
	businessCategoriesForSpecificLatLong: action,
	filteredMapData: computed,
	setAssetName: action,
	setBusinessCategory: action,
	decades: computed,
	latLongs: computed,
	businessCategories: computed,
	assetNames: computed,
	setLatLong: action,
	filteredChartData: computed,
	tableData: computed,
	init: action
});

export default RiskStore;

import { action, computed, makeObservable, observable } from "mobx";
import _ from 'lodash';

const BASE_URL = 'http://localhost:3000';
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
	filteredData: [] as IRiskData[],
	filteredChartData: [] as IRiskData[],
	decade: 2030 as number,
	decades: [] as number[],
	selectedBusinessCategory: null as unknown as string,
	selectedAssetName: null as unknown as string,
	selectedLatLong: null as unknown as string,
	businessCategories: [] as string[],
	assetNames: [] as string[],
	latLongs: [] as string[],
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
		console.log("New Decade :", year, this.decade);
		this.decade = year;
	},
	setAssetName(name: string) {
		this.selectedAssetName = name;
		this.setFilteredChartData();
	},
	setBusinessCategory(category: string) {
		this.selectedBusinessCategory = category;
		this.setFilteredChartData();
	},
	setLatLong(latLongString: string) {
		console.log("Set latlong", latLongString)
		this.selectedLatLong = latLongString;
	},
	setDecades() {
		this.decades = Array.from(new Set(this.data.map(d => {
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
	setBusinessCategories() {
		this.businessCategories = [NONE_STRING,...Array.from(new Set(this.data.map(d => {
			return d.businessCategory
		}))).sort()]
	},
	setAssetNames() {
		this.assetNames = [NONE_STRING, ...Array.from(new Set(this.data.map(d => {
			return d.assetName
		}))).sort()]
	},
	setLatLongs() {
		this.latLongs = [NONE_STRING, ...Array.from(new Set(this.data.map(d => {
			return d.lat.toString() + "," + d.long.toString();
		}))).sort()]
	},
	setFilteredData() {
		console.log("setting filtered data", this.decade);

		this.filteredData = this.data.filter((d) => d.year >= this.decade && d.year < this.decade + 10);
	},
	get tableData() {
		return this.data.filter((d) => d.year === this.decade);
	},
	setFilteredChartData() {
		this.filteredChartData = this.data.filter((d) => {
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
		console.log("filtered", this.filteredChartData);
	},
	latLongStringParser (lat: number, long:number) {
		const parsed =  lat.toString()+","+long.toString();
		return parsed;
	},
	async init() {
		await this.fetchData()
		.then(() => this.setDecade(this.decade))
		.then(() => this.setFilteredData())
		.then(() => this.setDecades())
		.then(() => this.setBusinessCategories())
		.then(() => this.setAssetNames())
		.then(() => this.setLatLongs())
		.then(() => this.setFilteredChartData())
	}
}

makeObservable(RiskStore, {
	data: observable,
	filteredData: observable,
	decade: observable,
	fetchData: action,
	riskData: computed,
	riskKeys: computed,
	decades: observable,
	selectedBusinessCategory: observable,
	selectedAssetName: observable,
	selectedLatLong: observable,
	businessCategories: observable,
	assetNames: observable,
	latLongs: observable,
	setDecade: action,
	setAssetName: action,
	setBusinessCategory: action,
	setLatLongs: action,
	setDecades: action,
	setBusinessCategories: action,
	setAssetNames: action,
	setLatLong: action,
	setFilteredData: action,
	setFilteredChartData: action,
	tableData: computed,
	init: action
});

export default RiskStore;

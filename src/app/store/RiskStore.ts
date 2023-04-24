import { action, computed, makeObservable, observable } from "mobx";
import _ from 'lodash';

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
	filteredChartData: [] as IRiskData[],
	decade: 2030 as number,
	decades: [] as number[],
	selectedBusinessCategory: null as unknown as string,
	selectedAssetName: null as unknown as string,
	selectedLatLong: {
		'lat': 0,
		'long': 0
	} as unknown as Record<string, number>,
	businessCategories: [] as string[],
	assetNames: [] as string[],
	latLongs: [] as Record<string, number>[],
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
		this.selectedLatLong = {
			'lat' : parseInt(latLongString.split(',')[0]),
			'long' : parseInt(latLongString.split(',')[1])
		}
	},
	setDecades() {
		this.decades = Array.from(new Set(this.data.map(d => {
			return d.year
		}))).sort()
	},
	setBusinessCategories() {
		this.businessCategories = ["Business Categories",...Array.from(new Set(this.data.map(d => {
			return d.businessCategory
		}))).sort()]
	},
	setAssetNames() {
		this.assetNames = ["Asset Names", ...Array.from(new Set(this.data.map(d => {
			return d.assetName
		}))).sort()]
	},
	setLatLongs() {
		this.latLongs = Array.from(new Set(this.data.map(d => {
			return {
				lat: d.lat,
				long: d.long
			}
		}))).sort()
	},
	setFilteredData() {
		console.log("setting filtered data", this.decade);

		this.filteredData = this.data.filter((d) => d.year >= this.decade && d.year < this.decade + 10);
	},
	setFilteredChartData() {
		this.filteredChartData = this.data.filter((d) => {
			if (this.selectedAssetName && this.selectedAssetName !== "Asset Names" && this.selectedAssetName !== d.assetName) {
				return false
			} 
			if (this.selectedBusinessCategory && this.selectedBusinessCategory !== "Business Categories" && this.selectedBusinessCategory !== d.businessCategory) {
				return false
			} 
			return true
		})
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
	init: action
});

export default RiskStore;

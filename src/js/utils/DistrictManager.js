import District from './district.js';

class DistrictManager {
    static instance = null; // Singleton instance
    districts = []; // Array to hold District objects
    loaded = false; // Flag to prevent multiple loads

    constructor() {
        // Enforce singleton pattern
        if (DistrictManager.instance) {
            return DistrictManager.instance;
        }
        // Set the singleton instance
        DistrictManager.instance = this;
    }

    // Static method to get the singleton instance
    static getInstance() {
        if (!DistrictManager.instance) {
            DistrictManager.instance = new DistrictManager();
        }
        return DistrictManager.instance;
    }

    // Load district boundaries from GeoJSON and create District objects
    async loadDistricts() {
        if (this.loaded) return;
        // Fetch GeoJSON data for Oregon House Districts
        const data = await fetch('/data/geo/House_Districts.geojson').then(r => r.json());
        const features = data.features;
        // Create District objects for each feature
        for (let i = 1; i <= 60; i++) {
            const districtCoords = features[i - 1].geometry.coordinates; 
            const district = new District(districtCoords, i);
            // Add the district to the manager's array
            this.districts.push(district);
            console.log('Loaded district ' + i);
        }
        // Mark as loaded to prevent future reloads
        this.loaded = true;
    }

    // Load representatives data and associate with districts
    async loadRepresentatives() {
        const data = await fetch('/data/geo/representatives.json').then(r => r.json());
        data.forEach(rep => {
            const districtNum = rep.DistrictNumber;
            if (districtNum >= 1 && districtNum <= 60) {
                this.districts[districtNum - 1].representative = rep;
            }
        });
        console.log('Loaded representatives data');
    }

    // Load senators data and associate with districts
    async loadSenators() {
        const data = await fetch('/data/geo/senators.json').then(r => r.json());
        data.forEach(senator => {
            const districtNum = senator.DistrictNumber;
            if (districtNum >= 1 && districtNum <= 30) {
                this.districts[districtNum - 1].senator = senator;
            }
        });
        console.log('Loaded senators data');
    }

    // Get all districts
    getAllDistricts() {
        return this.districts;
    }

    // Get a specific district by ID
    getDistrict(id) {
        return this.districts[id - 1];
    }

    // Find the district for a given location
    findDistrictForLocation(location) {
        const lat = location.lat();
        const lng = location.lng();

        // Filter by bounding box first (optimization)
        const possibles = this.districts.filter(d => !d.isOutside([lng, lat]));

        // Check each possible district
        for (let district of possibles) {
            if (this.isLocationInDistrict(location, district)) {
                return district;
            }
        }

        return null;
    }

    // Check if a location is inside a district polygon
    isLocationInDistrict(location, district) {
        try {
            // Create a polygon from the district's coordinates and check if the location is inside it
            const polygon = new google.maps.Polygon({
                paths: district.getCoordsAsObjects()
            });
            // Use the geometry library to check if the location is inside the polygon
            return google.maps.geometry.poly.containsLocation(location, polygon);
        } catch (error) {
            console.error('Error checking location:', error);
            return false;
        }
    }

    // Clear all addresses from all districts
    clearAllAddresses() {
        this.districts.forEach(d => d.clearAddresses());
    }

    // Get districts that have addresses
    getDistrictsWithAddresses() {
        return this.districts.filter(d => d.hasAddresses());
    }

    // Outline all districts on the map
    outlineAll(map) {
        this.districts.forEach(d => d.outline(map));
    }
}

export default DistrictManager; // Export the singleton instance of DistrictManager

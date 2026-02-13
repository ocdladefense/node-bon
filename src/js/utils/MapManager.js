class MapManager {
    static instance = null; // Singleton instance
    map = null; // Google Map instance
    currentPolygons = []; // Track current district polygons on the map for cleanup
    currentMarkers = []; // Track current address markers on the map for cleanup

    constructor() {
        // Enforce singleton pattern
        if (MapManager.instance) {
            return MapManager.instance;
        }
        // Set the singleton instance
        MapManager.instance = this;
    }

    // Static method to get the singleton instance
    static getInstance() {
        if (!MapManager.instance) {
            MapManager.instance = new MapManager();
        }
        return MapManager.instance;
    }

    // Initialize the Google Map
    async initialize() {
        const mapEl = document.getElementById('map');
        if (!mapEl) {
            console.error('Map element not found');
            return null;
        }
        // Create the Google Map centered on Oregon
        this.map = new google.maps.Map(mapEl, {
            zoom: 6,
            center: { lat: 43.9336, lng: -120.5583 },
            mapTypeId: 'roadmap'
        });
        // Return the map instance for chaining if needed
        return this.map;
    }

    // Getter for the map instance
    getMap() {
        return this.map;
    }

    clearPolygons() {
        // Remove all polygons from the map and clear the tracking array
        this.currentPolygons.forEach(polygon => polygon.setMap(null));
        this.currentPolygons = [];
    }

    clearMarkers() {
        // Remove all markers from the map and clear the tracking array
        this.currentMarkers.forEach(marker => marker.setMap(null));
        this.currentMarkers = [];
    }

    // Add a polygon to the map and track it for cleanup
    addPolygon(polygon) {
        this.currentPolygons.push(polygon);
    }

    // Add a marker to the map and track it for cleanup
    addMarker(marker) {
        this.currentMarkers.push(marker);
    }

    // Clear all polygons and markers from the map
    clearAll() {
        this.clearPolygons();
        this.clearMarkers();
    }
}

export default MapManager; // Export the singleton instance of MapManager

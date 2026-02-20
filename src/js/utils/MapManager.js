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
        MapManager.instance = this;
    }

    // Static method to get singleton instance
    static getInstance() {
        if (!MapManager.instance) {
            MapManager.instance = new MapManager();
        }
        return MapManager.instance;
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

    // Draw a list of districts on the map
    draw(districts, senateDistricts) {
        const allDistricts = [...districts, ...senateDistricts];
        allDistricts.forEach(district => {
            const polygon = district.outline(this.map); // Get the polygon for this district
            polygon.setMap(this.map); // Add the polygon to the map
            this.addPolygon(polygon); // Track the polygon for cleanup
        });
    }

    // Clear all polygons and markers from the map
    clearAll() {
        this.clearPolygons();
        this.clearMarkers();
    } 

    async load() {
        this.map = await load().then(requestLibraries).then(initMap).catch(error => {
            console.error('Error loading Google Maps:', error);
        });
    }
}




async function initMap()
{
    // Get the map element
    const mapEl = document.getElementById('map');
    if (!mapEl) {
        throw new Error('Map element not found');
    }
   


    // Initialize the map
    let map = new google.maps.Map(mapEl, {
        zoom: 6,
        center: { lat: 43.9336, lng: -120.5583 },
        mapTypeId: 'roadmap'
    });

    
    return map;
}

async function requestLibraries() {
    // Request needed libraries.
    await google.maps.importLibrary("maps");
    await google.maps.importLibrary("marker");
    await google.maps.importLibrary("geometry");
    await google.maps.importLibrary("geocoding");
}
    
function load(){
    let foobar = new Promise((resolve, reject) => {
        let script = createScriptElement("https://maps.googleapis.com/maps/api/js?key=AIzaSyCfWNi-jamfXgtp5iPBLn63XV_3u5RJK0c&");
        script.addEventListener('load', () => { 
            resolve();
        });
        injectScriptElement(script);
    });

    return foobar;
}







function injectScriptElement(tag) {

    let firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag == null) {
        (document.body || document.head).appendChild(tag);
    }
    else {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    return tag;
}

function createScriptElement(src) {
    let tag = document.createElement('script');
    tag.src = src;
    tag.async = true; // Load asynchronously to avoid blocking the page

    return tag;
}

export default MapManager; // Export the singleton instance of MapManager

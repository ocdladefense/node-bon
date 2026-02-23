import MapManager from './utils/MapManager.js';
import DistrictManager from './utils/DistrictManager.js';
import Address from './utils/Address.js';

function domReady(cb) {
    document.readyState === 'interactive' || document.readyState === 'complete'
        ? cb()
        : document.addEventListener('DOMContentLoaded', cb);
}

domReady(async function() {
    const districtManager = new DistrictManager();

    // Load all data
    await districtManager.loadDistricts();
    await districtManager.loadRepresentatives();
    await districtManager.loadSenators();

    // Initialize MapManager singleton
    const mapManager = MapManager.getInstance();
    await mapManager.load();

    // Outline all districts on the map
    districtManager.houseDistricts.forEach(district => mapManager.draw(district.getCoordsAsObjects(), district.id, false));
/*
    // Draw all districts on the map
    mapManager.draw(districtManager.houseDistricts);
    mapManager.draw(districtManager.senateDistricts);
    // Draw any existing markers (if needed)
    mapManager.draw(mapManager.currentMarkers); */

    // Set up form handler
    const form = document.getElementById('district-lookup');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        event.stopPropagation();

        const addressInput = document.getElementById('address').value;
        const resultDiv = document.getElementById('result');
        resultDiv.textContent = 'Checking...';

        // Clear previous results (highlights and markers only, keep outlines)
        mapManager.resetPolygons();
        districtManager.clearAllAddresses();

        
        // Parse addresses
        const addresses = addressInput.split('\n')
            .map(a => new Address(a.trim()))
            .filter(a => a.isValid()); // Filter out invalid addresses

        await Promise.all(addresses.map(addr => 
            addr.geocode().then((addr) => mapManager.drawMarker(addr)))); // Geocode all addresses in parallel




        
        addresses.forEach(addr => {
            addr.house = districtManager.findHouseDistrict(addr.location);
        }); // Associate addresses with districts




        addresses.forEach(addr => { 
            addr.senate = districtManager.findSenateDistrict(addr.location);
        }); // Associate addresses with senate districts for senator info


        addresses.forEach(addr => addr.house.addAddress(addr)); // Add addresses to their respective districts for info windows and counting
        addresses.forEach(addr => addr.senate.addAddress(addr)); // Add addresses to their respective senate districts for info windows and counting

        addresses.forEach(addr => {
            mapManager.shadePolygon(addr.house.id);
        });






        // Display results
        //const districtsWithAddresses = districtManager.getDistrictsWithAddresses();
        


        





    });
});

function displayTextResults() {
            // Display text results
        if (districtsWithAddresses.length > 0) {
            resultDiv.innerHTML = districtsWithAddresses.map(district => {
                const count = district.getAddressCount();
                return `District ${district.id}${count > 1 ? ` (${count} addresses)` : ''}`;
            }).join('<br />');

        } else {
            resultDiv.textContent = "Not found";
        }
}

// Usage example
// isAddressInKMLPolygon("1600 Amphitheatre Parkway, Mountain View, CA");

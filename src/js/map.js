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
    districtManager.outlineAll(mapManager.getMap());
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

        // Clear previous results (highlights and markers)
        mapManager.clearAll();
        districtManager.clearAllAddresses();

        // Parse addresses
        const addressStrings = addressInput.split('\n')
            .map(a => a.trim())
            .filter(a => a.length > 0);

        // Geocode all addresses
        const locations = await Promise.all(
            addressStrings.map(async (addr) => {
                try {
                    return await Address.geocode(addr);
                } catch (error) {
                    console.error('Geocoding failed for:', addr, error);
                    return null;
                }
            })
        );

        // Find districts and create Address objects
        const results = addressStrings.map((addrString, i) => {
            const location = locations[i];
            if (!location) return null;
            // Find the district for this location
            const district = districtManager.findDistrictForLocation(location);
            if (!district) return null;
            // Create an Address object and add it to the district
            const address = new Address(addrString, location, district);
            // Return the district and address for display
            district.addAddress(address);
            return { district, address };
        }).filter(r => r !== null);

        // Display results
        const districtsWithAddresses = districtManager.getDistrictsWithAddresses();
        
        // If we found any districts, display them and add markers
        if (districtsWithAddresses.length > 0) {
            resultDiv.innerHTML = districtsWithAddresses.map(district => {
                const count = district.getAddressCount();
                return `District ${district.id}${count > 1 ? ` (${count} addresses)` : ''}`;
            }).join('<br />');

            // Highlight districts and draw markers
            const map = mapManager.getMap();
            districtsWithAddresses.forEach(district => {
                district.highlight(map, districtManager);
                district.drawMarkers(map);
            });
            /*
            // Fit map to show all results
            const bounds = new google.maps.LatLngBounds();
            districtsWithAddresses.forEach(district => {
                district.addresses.forEach(addr => bounds.extend(addr.location));
            });
            map.fitBounds(bounds);*/
        } else {
            resultDiv.textContent = "Not found";
        }
    });
});

// Usage example
// isAddressInKMLPolygon("1600 Amphitheatre Parkway, Mountain View, CA");

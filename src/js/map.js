import MapManager from './utils/MapManager.js';
import DistrictManager from './utils/DistrictManager.js';
import Address from './utils/Address.js';
import Cache from './utils/Cache.js';
import { displayTextResults } from './utils/DistrictToAddressesTable.js';

function domReady(cb) {
    document.readyState === 'interactive' || document.readyState === 'complete'
        ? cb()
        : document.addEventListener('DOMContentLoaded', cb);
}

domReady(async function() {
    const districtManager = new DistrictManager();
    const cache = new Cache();

    // Load all data
    await districtManager.loadDistricts();
    await districtManager.loadRepresentatives();
    await districtManager.loadSenators();

    // Initialize MapManager singleton
    const mapManager = MapManager.getInstance();
    await mapManager.load();

    // Outline all districts on the map
    districtManager.houseDistricts.forEach(district =>
        mapManager.draw(district.getCoordsAsObjects(), mapManager.getPolygonType('house', district.id), false)
    );
    districtManager.senateDistricts.forEach(district =>
        mapManager.draw(district.getCoordsAsObjects(), mapManager.getPolygonType('senate', district.id), false)
    );
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
        mapManager.clearMarkers();
        districtManager.clearAllAddresses();

        
        // Parse addresses
        const addresses = addressInput.split('\n')
            .map(a => new Address(a.trim()))
            .filter(a => a.isValid()); // Filter out invalid addresses

        await Promise.all(addresses.map(addr => 
            addr.geocode().then((addr) => mapManager.drawMarker(addr)))); // Geocode all addresses in parallel

        // Process each address, checking cache first
        addresses.forEach(addr => {
            
            // First check the cache for this address by ZIP
            const cached = cache.lookUp(addr.zip);

            if (cached) {
                // Exact match found in cache
                if (cached.houseId) {
                    // If we have a cached house district ID, retrieve the full district object
                    addr.house = districtManager.getHouseDistrict(cached.houseId); 

                }
                if (cached.senateId) {
                    // If we have a cached senate district ID, retrieve the full district object
                    addr.senate = districtManager.getSenateDistrict(cached.senateId);

                }

                console.log(`Cache hit for ${addr.address}: House ${addr.house ? addr.house.id : 'N/A'}, Senate ${addr.senate ? addr.senate.id : 'N/A'}`);
            } else {
                // Not in cache, find districts first, then store
                addr.house = districtManager.findHouseDistrict(addr.location);
                addr.senate = districtManager.findSenateDistrict(addr.location);
                cache.storeResult(addr);
                console.log(`Cache miss for ${addr.address}: House ${addr.house ? addr.house.id : 'N/A'}, Senate ${addr.senate ? addr.senate.id : 'N/A'}`);
            }
        });



        // Save result in the cache
        // Result has house, senate, and zipcode
        
        //let results = cache.getResults();
        // Everytime lookup finds something in the cache, increment hit counter
        console.log("Hits: " + cache.getHits());
        console.log("Misses: " + cache.getMisses());


        addresses.forEach(addr => { 
            if (addr.house) // Only add to district if we found a valid one
                 addr.house.addAddress(addr); }); // Add addresses to their respective districts for info windows and counting
        addresses.forEach(addr => { 
            if (addr.senate) // Only add to district if we found a valid one
                 addr.senate.addAddress(addr); }); // Add addresses to their respective senate districts for info windows and counting

        addresses.forEach(addr => {
            if (addr.house) {
                mapManager.shadePolygon(mapManager.getPolygonType('house', addr.house.id));
            }
        });
        


        

        // Display text results
        const houseDistrictsWithAddresses = districtManager.getHouseDistrictsWithAddresses();
        const senateDistrictsWithAddresses = districtManager.getSenateDistrictsWithAddresses();
        
        displayTextResults(houseDistrictsWithAddresses, senateDistrictsWithAddresses);

    });
});



// Usage example
// isAddressInKMLPolygon("1600 Amphitheatre Parkway, Mountain View, CA");

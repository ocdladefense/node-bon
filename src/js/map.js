import MapManager from './utils/MapManager.js';
import DistrictManager from './utils/DistrictManager.js';
import Address from './utils/Address.js';
import Cache from './utils/Cache.js';
import { displayTextResults } from './components/DistrictToAddressesTable.js';
import { domReady } from './utils/html.js';



let districtManager;
let cache;
let mapManager;









// Work #1 - Load data and initialize map.
domReady(async function() {
    districtManager = new DistrictManager();
    // Try to load cache from server first, fall back to localStorage
    cache = await Cache.loadFromServer();
    // If server cache is empty, try localStorage as fallback
    if (cache.getResults().length === 0) {
        const localCache = Cache.loadFromLocalStorage();
        if (localCache.getResults().length > 0) {
            cache = localCache;
        }
    }
    mapManager = MapManager.getInstance();

    // Load all data
    await districtManager.loadDistricts();
    await districtManager.loadRepresentatives();
    await districtManager.loadSenators();

    // Initialize MapManager singleton

    await mapManager.load();
});


// Work #2 - Draw district outlines on the map.
domReady(async function() {

    console.log("Drawing districts on the map...");
    // Outline all districts on the map
    districtManager.houseDistricts.forEach(district => {
        // console.log(`Drawing House District ${district.id} with ${district.coords.length} coordinates...`);
        mapManager.draw(district.getCoordsAsObjects(), 'H' + district.id, false)
    });
    districtManager.senateDistricts.forEach(district => {
        // console.log(`Drawing Senate District ${district.id} with ${district.coords.length} coordinates...`);
        mapManager.draw(district.getCoordsAsObjects(), 'S' + district.id, false)
    });
});



// Work #3 - Set up form handler.
domReady(async function() {
    // Set up form handler
    const form = document.getElementById('district-lookup');
    form.addEventListener('submit', onSubmit);
});



async function doWork(addresses) {


    await Promise.all(addresses.map(addr =>
        addr.geocode().then((addr) => mapManager.drawMarker(addr)))); // Geocode all addresses in parallel

    // Process each address, checking cache first
    addresses.forEach(addr => {

        // First check the cache for this address by ZIP
        const cached = cache.lookup(addr.zip);

        // Check if cached districts actually match the geocoded location (to avoid false cache hits from ZIPs with multiple districts)
        let canUseCached = false;

        // If we have cached districts for this ZIP, verify that the geocoded location is actually within those districts before using the cache
        if (cached)
        {
            const cachedHouseDistrict = districtManager.getHouseDistrict(cached.house);
            const cachedSenateDistrict = districtManager.getSenateDistrict(cached.senate);

            // Verify that the geocoded location is actually within the cached districts
            canUseCached = !!cachedHouseDistrict
                && !!cachedSenateDistrict
                && districtManager.isLocationInDistrict(addr.location, cachedHouseDistrict)
                && districtManager.isLocationInDistrict(addr.location, cachedSenateDistrict);
        }

        // Use cache only when the geocoded point actually matches cached districts.
        // If not, recompute and let cache.put() record a variant for this ZIP.
        addr.house = canUseCached ? cached.house : districtManager.findHouseDistrict(addr.location);
        addr.senate = canUseCached ? cached.senate : districtManager.findSenateDistrict(addr.location);


        // Might not want to do this each time.
        cache.put(addr);

    });



    cache.saveToLocalStorage();
    // Also save to server
    await cache.saveToServer();
    // Save result in the cache
    // Result has house, senate, and zipcode

    //let results = cache.getResults();
    // Everytime lookup finds something in the cache, increment hit counter
    console.log("Hits: " + cache.getHits());
    console.log("Misses: " + cache.getMisses());
    console.log("Variants", cache.variants);



    let groupedByHouse = Object.groupBy(addresses, a => a.house);
    let groupedBySenate = Object.groupBy(addresses, a => a.senate);

    for (let houseId in groupedByHouse)
    {
        let house = districtManager.getHouseDistrict(houseId);
        if (null == house) continue;
        house.addAddresses(groupedByHouse[houseId]);
    }

    for (let senateId in groupedBySenate)
    {
        let senate = districtManager.getSenateDistrict(senateId);
        if (null == senate) continue;
        senate.addAddresses(groupedBySenate[senateId]);
    }


    for (let houseId in groupedByHouse)
    {
        mapManager.shadePolygon('H' + houseId);
    }
}





async function onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    const addressInput = document.getElementById('address').value;
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = 'Checking...';


    // Parse addresses
    const addresses = addressInput.split('\n')
        .map(a => new Address(a.trim()))
        .filter(a => a.isValid()); // Filter out invalid addresses




    // Clear previous results (highlights and markers only, keep outlines)
    mapManager.resetPolygons();
    mapManager.clearMarkers();
    districtManager.clearAllAddresses();

    // Process the addresses, geocoding and finding districts, with caching.
    await doWork(addresses);

    // Display text results.
    const houseDistrictsWithAddresses = districtManager.getHouseDistrictsWithAddresses();
    const senateDistrictsWithAddresses = districtManager.getSenateDistrictsWithAddresses();

    displayTextResults(houseDistrictsWithAddresses, senateDistrictsWithAddresses);

}

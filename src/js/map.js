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




        
        addresses.forEach(addr => {
            addr.house = districtManager.findHouseDistrict(addr.location);
        }); // Associate addresses with districts




        addresses.forEach(addr => { 
            addr.senate = districtManager.findSenateDistrict(addr.location);
        }); // Associate addresses with senate districts for senator info


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

// Display text results for both house and senate districts 
function displayTextResults(houseDistrictsWithAddresses, senateDistrictsWithAddresses) {
    const resultDiv = document.getElementById('result');
    const mapManager = MapManager.getInstance();
    
    // Build table HTML for house districts
    function buildHouseTable() {
        const rows = houseDistrictsWithAddresses.map(district => {
            const addressesHTML = district.addresses.map(addr => `<li>${addr.address}</li>`).join('');
            // Each row will show the district and its associated addresses
            return `
                <tr style="border: 1px solid #ccc;">
                    <td style="border: 1px solid #ccc; padding: 8px;">
                        <strong>House District ${district.id}</strong>
                    </td>
                    <td style="border: 1px solid #ccc; padding: 8px;">
                        <ul>${addressesHTML}</ul>
                    </td>
                </tr>
            `;
        }).join('');
        // Wrap rows in a table structure
        return `
            <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background-color: #f0f0f0;">
                <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">District</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Addresses</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
            </table>
        `;
    }
    
    // Build table HTML for senate districts
    function buildSenateTable() {
        const rows = senateDistrictsWithAddresses.map(district => {
            const addressesHTML = district.addresses.map(addr => `<li>${addr.address}</li>`).join('');
            // Each row will show the district and its associated addresses
            return `
                <tr style="border: 1px solid #ccc;">
                    <td style="border: 1px solid #ccc; padding: 8px;">
                        <strong>Senate District ${district.id}</strong>
                    </td>
                    <td style="border: 1px solid #ccc; padding: 8px;">
                        <ul>${addressesHTML}</ul>
                    </td>
                </tr>
            `;
        }).join('');
        // Wrap rows in a table structure
        return `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f0f0f0;">
                        <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">District</th>
                        <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Addresses</th>
                    </tr>
                </thead>
                <tbody style="border: 1px solid #ccc; padding: 8px;">
                    ${rows}
                </tbody>
            </table>
        `;
    }
    
    // Display results via dropdown list
    resultDiv.innerHTML = `
        <label for="district-select">Show info for:</label>
        <select id="district-select">
            <option value="">--Select a district--</option>
            <option value="house">House Districts</option>
            <option value="senate">Senate Districts</option>
        </select>
        <div id="district-info" style="margin-top: 10px;"></div>
    `;
    const select = document.getElementById('district-select');
    const infoDiv = document.getElementById('district-info');
    
    select.addEventListener('change', function() {
        const selectedValue = this.value;
        
        // Reset all polygons to unshaded state
        mapManager.resetPolygons();
        infoDiv.innerHTML = '';
        
        if (selectedValue === 'house') {
            // Display house district info and shade those house districts on the map
            infoDiv.innerHTML = buildHouseTable();
            houseDistrictsWithAddresses.forEach(district =>
                mapManager.shadePolygon(mapManager.getPolygonType('house', district.id))
            );
        } else if (selectedValue === 'senate') {
            // Display senate district info and shade those senate districts on the map
            infoDiv.innerHTML = buildSenateTable();
            senateDistrictsWithAddresses.forEach(district =>
                mapManager.shadePolygon(mapManager.getPolygonType('senate', district.id))
            );
        }
    });
}

// Usage example
// isAddressInKMLPolygon("1600 Amphitheatre Parkway, Mountain View, CA");

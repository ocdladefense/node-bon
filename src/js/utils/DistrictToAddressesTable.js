import MapManager from './MapManager.js';
import DistrictManager from './DistrictManager.js';


// Display text results for both house and senate districts 
export function displayTextResults(houseDistrictsWithAddresses, senateDistrictsWithAddresses) {
    const resultDiv = document.getElementById('result');
    const mapManager = MapManager.getInstance();
    const districtManager = new DistrictManager();
    
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
            houseDistrictsWithAddresses.forEach(district => {
                // Shade the polygon
                mapManager.shadePolygon(mapManager.getPolygonType('house', district.id));
                // Make it clickable
                mapManager.makePolygonClickable(
                    mapManager.getPolygonType('house', district.id),
                    true,
                    (event) => district.getHouseDistrictInfo(event.latLng, districtManager)
                );
            });
            
            // Add click listeners to table rows
            document.querySelectorAll('#district-info table tbody tr').forEach((row, index) => {
                row.style.cursor = 'pointer';
                row.addEventListener('click', async () => {
                    // Get the corresponding district for this row
                    const district = houseDistrictsWithAddresses[index];
                    const infoContent = await district.getHouseDistrictInfo();
                    const infoWindow = new google.maps.InfoWindow({ content: infoContent });
                    // Center on the district
                    const bounds = new google.maps.LatLngBounds();
                    district.getCoordsAsObjects().forEach(coord => bounds.extend(coord));
                    infoWindow.setPosition(bounds.getCenter());
                    infoWindow.open(mapManager.getMap());
                });
            });
        } else if (selectedValue === 'senate') {
            // Display senate district info and shade those senate districts on the map
            infoDiv.innerHTML = buildSenateTable();
            senateDistrictsWithAddresses.forEach(district => {
                // Shade the polygon
                mapManager.shadePolygon(mapManager.getPolygonType('senate', district.id));
                // Make it clickable
                mapManager.makePolygonClickable(
                    mapManager.getPolygonType('senate', district.id),
                    true,
                    (event) => district.getSenateDistrictInfo(event.latLng, districtManager)
                );
            });
            
            // Add click listeners to table rows
            document.querySelectorAll('#district-info table tbody tr').forEach((row, index) => {
                row.style.cursor = 'pointer';
                row.addEventListener('click', async () => {
                    // Get the corresponding district for this row
                    const district = senateDistrictsWithAddresses[index];
                    const infoContent = await district.getSenateDistrictInfo();
                    const infoWindow = new google.maps.InfoWindow({ content: infoContent });
                    // Center on the district
                    const bounds = new google.maps.LatLngBounds();
                    district.getCoordsAsObjects().forEach(coord => bounds.extend(coord));
                    infoWindow.setPosition(bounds.getCenter());
                    infoWindow.open(mapManager.getMap());
                });
            });
        }
    });
}

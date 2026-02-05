import { getStartQuadrant, districts, remainingDistricts } from './utils/District.js';
import District from './utils/District.js';
function domReady(cb)
{
    document.readyState === 'interactive' || document.readyState === 'complete'
        ? cb()
        : document.addEventListener('DOMContentLoaded', cb);
}

domReady(async function()
{
    // Get all districts data
    let data = await fetch('/data/geo/House_Districts.geojson').then(response => response.json());
    let features = data.features;
    for (let i = 1; i <= 60; i++) {
        let districtCoords = features[i - 1].geometry.coordinates;
        let district = new District(districtCoords);
        districts.push(district);
        console.log('Loaded district ' + i);
    }
    
    let form = document.getElementById('district-lookup');
    form.addEventListener('submit', async function(event)
    {

        let action = event.submitter.id;
        event.preventDefault(); // Prevent form submission
        event.stopPropagation();
        let address = document.getElementById('address').value;
        let resultDiv = document.getElementById('result');
        resultDiv.textContent = 'Checking...';

        // Address can take multiple addresses separated by new lines
        let addresses = address.split('\n').map(a => a.trim()).filter(a => a.length > 0);

        let results = [];

        // Process each address sequentially
        for (let i = 0; i < addresses.length; i++) {
            resultDiv.textContent = `Checking address ${i + 1} of ${addresses.length}...`;

            try {
                // Geocode the address
                const addressLatLng = await geocodeAddress(addresses[i]);

                // Find which district the address is in
                let statusMessage = await showDistrict(addressLatLng);
                results.push({
                    address: addresses[i],
                    result: statusMessage
                });
            } catch (error) {
                results.push({
                    address: addresses[i],
                    result: error
                });
            }
        }

        // Display all results
        resultDiv.innerHTML = results.map(r => `<strong>${r.address}:</strong> ${r.result}`).join('<br><br>');

        // Divide and conquer here.
        // Divide the state into three quadrants.
        // Based on latitude and longitude of the address,
        // determine which quadrant it falls into,
        // then only load and check the KML polygon for that quadrant.
    });
});



// User wants to find which district the address is in.
async function showDistrict(addressLatLng)
{
    // Try quadrant first (optimization)
    let startQuadrant = getStartQuadrant(addressLatLng);
    const addressLat = addressLatLng.lat();
    const addressLng = addressLatLng.lng();
    // Log starting quadrant name for debugging
    console.log('Determined starting quadrant with ' + startQuadrant.length + ' districts...');
    // Check districts in the starting quadrant object first
    for (let district of startQuadrant) {
        // Get district object number
        // PSUDO: if district.isOutside(addressLatLng) continue;
        let districtNum = districts.indexOf(district) + 1;
        console.log('Checking district ' + districtNum + '...');
        // Check if address is outside district for quick elimination
        if (district.isOutside(addressLat, addressLng)) {
            continue;
        }
        // If not outside, do full check
        if (isLatLngInDistrict(addressLatLng, district)) {
            return 'The address is inside House District ' + districtNum + '.';
        }
    }

    // If not found in quadrant, check array of districts
    const remainingDistrictsList = remainingDistricts(startQuadrant);
    console.log('Checking remaining ' + remainingDistrictsList.length + ' districts...');
    // Check remaining districts
    for (let districtNum of remainingDistrictsList) {
        console.log('Checking district ' + districtNum + '...');
        // Get the District object from the districts array (districtNum is 1-indexed)
        let district = districts[districtNum - 1];
        // Check if address is in district
        if (district.isOutside(addressLat, addressLng)) {
            continue;
        }
        // If not outside, do full check
        if (isLatLngInDistrict(addressLatLng, district)) {
            return 'The address is inside House District ' + districtNum + '.';
        }
    }

    return 'Address could not be matched to any Oregon House District. Please verify the address is in Oregon.';
}


// 1. Geocode the Address (assuming you have a geocoding service or API call)
async function geocodeAddress(address)
{
    const geocoder = new google.maps.Geocoder();
    return await new Promise((resolve, reject) =>
    {
        geocoder.geocode({ 'address': address }, (results, status) =>
        {
            if (status === 'OK') {
                resolve(results[0].geometry.location); // Returns LatLng object
            } else {
                reject('Geocode was not successful for the following reason: ' + status);
            }
        });
    });
}




// Main function to check if address is inside polygon
function isLatLngInDistrict(addressLatLng, district)
{
    try {

        const kmlPolygon = new google.maps.Polygon({ paths: district.getLatLngPath() });
        // 4. Use containsLocation()
        const isInside = google.maps.geometry.poly.containsLocation(addressLatLng, kmlPolygon);

        return isInside;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

// Usage example
// isAddressInKMLPolygon("1600 Amphitheatre Parkway, Mountain View, CA");

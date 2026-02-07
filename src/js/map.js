import { getStartQuadrant, districts, remainingDistricts } from './utils/District.js';
import District from './utils/District.js';

// Global map and polygon variables
let currentPolygons = [];
let currentMarkers = [];

function domReady(cb) {
    document.readyState === 'interactive' || document.readyState === 'complete'
        ? cb()
        : document.addEventListener('DOMContentLoaded', cb);
}

async function loadDistricts() {
    // Get all districts data
    let data = await fetch('/data/geo/House_Districts.geojson').then(response => response.json());
    let features = data.features;
    for (let i = 1; i <= 60; i++)

        {

        let districtCoords = features[i - 1].geometry.coordinates;
        let district = new District(districtCoords, i);
        districts.push(district);
        console.log('Loaded district ' + i);
    }
}

async function loadRepresentatives() {
    // Get all representatives data
    let data = await fetch('/data/geo/representatives.json').then(response => response.json());
    // Process representatives data as needed (e.g., store in a variable, display on the page, etc.)
    // pair representatives with their districts for easy lookup when displaying results
    data.forEach(rep => {
        let districtNum = rep.DistrictNumber;
        if (districtNum >= 1 && districtNum <= 60) {
            let district = districts[districtNum - 1]; // Get the District object (districtNum is 1-indexed)
            district.representative = rep; // Add representative info to the District object
        }
    });
    console.log('Loaded representatives data');
}

async function loadSenators() {
    // Get all senators data
    let data = await fetch('/data/geo/senators.json').then(response => response.json());
    // Process senators data as needed (e.g., store in a variable, display on the page, etc.)
    // pair senators with their districts for easy lookup when displaying results
    data.forEach(senator => {
        let districtNum = senator.DistrictNumber;
        if (districtNum >= 1 && districtNum <= 30) {
            let district = districts[districtNum - 1]; // Get the District object (districtNum is 1-indexed)
            district.senator = senator; // Add senator info to the District object
        }
    });
    console.log('Loaded senators data');
}

domReady(async function() {

    // Load up all of the district data so we don't have to "wait" on submission.
    // This is perceived efficiency - the user will experience a delay on page load, but then no delay when they submit the form. If we waited to load until form submission, the user would experience a delay after submission, which is worse UX.
    await loadDistricts();
    await loadRepresentatives();
    await loadSenators();

    let form = document.getElementById('district-lookup');
    form.addEventListener('submit', async function(event) {

        let action = event.submitter.id;
        event.preventDefault(); // Prevent form submission
        event.stopPropagation();
        let address = document.getElementById('address').value;
        let resultDiv = document.getElementById('result');
        resultDiv.textContent = 'Checking...';

        // Clear previous polygons
        currentPolygons.forEach(polygon => polygon.setMap(null));
        currentPolygons = [];

        // Remove previous marker(s) after new search
        currentMarkers.forEach(marker => marker.setMap(null));
        currentMarkers = [];

        // Address can take multiple addresses separated by new lines
        let addresses = address.split('\n').map(a => a.trim()).filter(a => a.length > 0);

        // Batch geocode all addresses into points.
        const points = await Promise.all(addresses.map(async (address) => await geocodeAddress(address)));

        // Batch all points into their districts.
        let results = points.map((addressLatLng) => showDistrict(addressLatLng));

        // If more than one address is in a district display district only once with the number of addresses in parentheses. If only one address is in a district, display as normal. 
        // If no addresses are found in any district, display "Not found"
        let districtCounts = {};
        results.forEach(district => {
            if (!district) return;
            districtCounts[district.id] = (districtCounts[district.id] || 0) + 1;
        });

        // Render results
        
        if (Object.keys(districtCounts).length > 0) {
            resultDiv.innerHTML = Object.entries(districtCounts).map(([districtId, count]) => {
                return 'District ' + districtId + (count > 1 ? ' (' + count + ' addresses)' : '');
            }).join('<br />');

            // Draw the district(s) on the map
            Object.keys(districtCounts).forEach(districtId => {
                let district = districts[districtId - 1];
                let addressLatLng = points[results.findIndex(d => d && d.id === parseInt(districtId))];
                drawDistrictOnMap(district, addressLatLng);
            });
        } else {
            resultDiv.textContent = "Not found";
        }/* 
       // Render results
       resultDiv.innerHTML = results.map(district => !district ? "Not found" : "District " + district.id).join('<br />');
            // Draw the district(s) on the map
            results.forEach((district, index) => {
                if (district) {
                    drawDistrictOnMap(district, points[index]);
                }
            }); */
    });
});

// Function to draw district on map
function drawDistrictOnMap(district, addressLatLng) {
    if (!map || !district) return;

    // Create and draw the polygon once per district, not once per address in the district
    const polygon = new google.maps.Polygon({
        paths: district.getAsGoogleMapCoords(),
        fillColor: '#2b6cb0',
        fillOpacity: 0.35,
        strokeColor: '#2b6cb0',
        strokeOpacity: 1,
        strokeWeight: 2,
        clickable: true
    });
    polygon.setMap(map);
    currentPolygons.push(polygon);

    const infoWindow = new google.maps.InfoWindow({
        content: 'Loading...'
    });

    // add click listener to polygon to show representative and senator info
    google.maps.event.addListener(polygon, 'click', () => {
        // Set the content of the info window to the representative and senator info
        infoWindow.setContent('<div><strong>District ' + district.id + '</strong><br>' + (district.representative ? '<b>Representative: </b>' + district.representative.FirstName + ' ' + district.representative.LastName + ' ' + '<br>' + district.representative.Party + ' ' + '<br>' + district.representative.EmailAddress + '<br>' : '') + (district.senator ? '<b>Senator: </b>' + district.senator.FirstName + ' ' + district.senator.LastName + ' ' + '<br>' + district.senator.Party + ' ' + '<br>' + district.senator.EmailAddress + '<br>' : '') + '</div>');
        // Position the info window at the clicked location
        infoWindow.setPosition(addressLatLng);
        // Open the info window at the clicked location
        infoWindow.open(map, polygon);
    });

    // Add a marker at the address location
    const marker = new google.maps.Marker({
        position: addressLatLng,
        map: map,
        title: addressLatLng ? addressLatLng.toUrlValue() : ''
    });
    currentMarkers.push(marker);

    // Calculate bounds for the district
    const bounds = new google.maps.LatLngBounds();
    district.getAsGoogleMapCoords().forEach(coord => {
        bounds.extend(coord);
    });

    // Fit map to district bounds
    map.fitBounds(bounds);
    console.log('Representative of District ' + district.id + ': ' + district.representative.FirstName + ' ' + district.representative.LastName);
    if (district.senator) {
        console.log('Senator of District ' + district.id + ': ' + district.senator.FirstName + ' ' + district.senator.LastName);
    }
}

// User wants to find which district the address is in.
function showDistrict(addressLatLng) {
    // Try quadrant first (optimization)
    // let startQuadrant = getStartQuadrant(addressLatLng);
    const addressLat = addressLatLng.lat();
    const addressLng = addressLatLng.lng();
    // Log starting quadrant name for debugging
    // console.log('Determined starting quadrant with ' + startQuadrant.length + ' districts...');



    let possibles = districts.filter(d => !d.isOutside([addressLng, addressLat]));


    for (let district of possibles)
    {
        console.log('Checking district ' + (districts.indexOf(district) + 1) + '...');
        if (isLatLngInDistrict(addressLatLng, district))
        {
            return district;
        }
    }


    // If not found in quadrant, check array of districts
    // const remainingDistrictsList = remainingDistricts(startQuadrant);
    // console.log('Checking remaining ' + remainingDistrictsList.length + ' districts...');



    /*
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
        */

    return null;
}


// 1. Geocode the Address (assuming you have a geocoding service or API call)
async function geocodeAddress(address) {
    const geocoder = new google.maps.Geocoder();
    return await new Promise((resolve, reject) => {
        geocoder.geocode({ 'address': address }, (results, status) => {
            if (status === 'OK')
            {
                resolve(results[0].geometry.location); // Returns LatLng object
            } else
            {
                reject('Geocode was not successful for the following reason: ' + status);
            }
        });
    });
}




// Main function to check if address is inside polygon
function isLatLngInDistrict(addressLatLng, district) {
    try
    {

        const kmlPolygon = new google.maps.Polygon({ paths: district.getAsGoogleMapCoords() });
        // 4. Use containsLocation()
        return google.maps.geometry.poly.containsLocation(addressLatLng, kmlPolygon);
    } catch (error)
    {
        console.error('Error:', error);
        return false;
    }
}

// Usage example
// isAddressInKMLPolygon("1600 Amphitheatre Parkway, Mountain View, CA");

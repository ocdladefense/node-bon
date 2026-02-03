

// Separate out districts into regions.
// This allows us to optimize the search by only checking
// districts in the relevant region first.
const urban = [10, 11, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52];

const southernOregon = [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 56];

const easternOregon = [53, 54, 55, 57, 58, 59, 60]; // Add districts as needed

export let districts = [];




export default class District {
    constructor(coords) {

        this.coords = coords[0]; // Assuming coords is an array of arrays
    }

    // Convert coords to LatLng objects for Google Maps
    getLatLngPath() {
        // Convert [lng, lat] to {lat: lat, lng: lng}
        return this.coords.map(p => ({ lat: p[1], lng: p[0] }));
    }
    // Returns the westernmost point of the district 
    getWesternMostPoint() {

        // Get western most longitude point
        const westernMostPoint = this.coords.reduce((westernPoint, currentPoint) => {
            return currentPoint[0] < westernPoint[0] ? currentPoint : westernPoint;
        }, this.coords[0]);
        return westernMostPoint;
    }

    getEasternMostPoint() {
        // Get eastern most longitude point
        const easternMostPoint = this.coords.reduce((easternPoint, currentPoint) => {
            return currentPoint[0] > easternPoint[0] ? currentPoint : easternPoint;
        }, this.coords[0]);
        return easternMostPoint;
    }

    getSouthernMostPoint() {

        // Get southern most latitude point
        const southernMostPoint = this.coords.reduce((southernPoint, currentPoint) => {
            return currentPoint[1] < southernPoint[1] ? currentPoint : southernPoint;
        }, this.coords[0]);
        return southernMostPoint;
    }
}


function isUrban(point) {

    let southernDistrict = districts[9]; // District 10 is urban southernmost
    let southernMostPoint = southernDistrict.getSouthernMostPoint();
    let easternMostPoint = southernDistrict.getEasternMostPoint();

    if (point.lat() >= southernMostPoint[1] && point.lng() <= easternMostPoint[0])
    {
        return true;
    } else
    {
        return false;
    }
}

function isEasternOregon(point) {

    let easternDistrict = districts[54]; // Example: District 55 is in Eastern Oregon
    let westernMostPoint = easternDistrict.getWesternMostPoint();




    if (point.lng() > westernMostPoint[0])
    {
        return true;
    } else
    {
        return false;
    }
}

function isSouthernOregon(point) {
    let northernDistrict = districts[11]; // Example: District 12 is in Southern Oregon
    let easternMostPoint = northernDistrict.getEasternMostPoint();

    if (point.lat() < easternMostPoint[1])
    {
        return true;
    } else
    {
        return false;
    }
}

// Determine starting quadrant based on address location
export function getStartQuadrant(point) {
    // Determine which region the point is in
    let nums;
    // Return array of district numbers in that region
    if (isEasternOregon(point)) nums = easternOregon;
    else if (isSouthernOregon(point)) nums = southernOregon;
    else nums = urban;
    // Map district numbers to district objects
    return nums.map(n => districts[n - 1]);
}

// Get remaining districts not in starting quadrant
export function remainingDistricts(startQuadrant) {
    // Get district numbers in starting quadrant
    let startDistrictNums = startQuadrant.map(d => districts.indexOf(d) + 1);
    // Get all district numbers
    let allDistrictNums = districts.map((d, i) => i + 1);
    // Return district numbers not in starting quadrant
    return allDistrictNums.filter(n => !startDistrictNums.includes(n));
}



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
        // Precalculate bounding box points for performance
        let westernMostPoint = this.coords[0];
        let easternMostPoint = this.coords[0];
        let southernMostPoint = this.coords[0];
        let northernMostPoint = this.coords[0];
        // Find bounding box
        for (let i = 1; i < this.coords.length; i++) {
            const point = this.coords[i];
            if (point[0] < westernMostPoint[0]) westernMostPoint = point;
            if (point[0] > easternMostPoint[0]) easternMostPoint = point;
            if (point[1] < southernMostPoint[1]) southernMostPoint = point;
            if (point[1] > northernMostPoint[1]) northernMostPoint = point;
        }
        // Store bounding box points
        this.westernMostPoint = westernMostPoint;
        this.easternMostPoint = easternMostPoint;
        this.southernMostPoint = southernMostPoint;
        this.northernMostPoint = northernMostPoint;
        console.log('District bounding box: W:' + westernMostPoint + ' E:' + easternMostPoint + ' S:' + southernMostPoint + ' N:' + northernMostPoint);
    }

    // Convert coords to LatLng objects for Google Maps
    getLatLngPath() {
        // Convert [lng, lat] to {lat: lat, lng: lng}
        return this.coords.map(p => ({ lat: p[1], lng: p[0] }));
    }
    // Returns the westernmost point of the district 
    static getWesternMostPoint(district) {
        // Get western most longitude point
        return district.westernMostPoint;
    }

    static getEasternMostPoint(district) {
        // Get eastern most longitude point
        return district.easternMostPoint;
    }

    static getSouthernMostPoint(district) {
        // Get southern most latitude point
        return district.southernMostPoint;
    }

    static getNorthernMostPoint(district) {
        return district.northernMostPoint;
    }

    isOutside(lat, lng) {
        // Quick check using bounding box
        const westernMostPoint = District.getWesternMostPoint(this);
        const easternMostPoint = District.getEasternMostPoint(this);
        const southernMostPoint = District.getSouthernMostPoint(this);
        const northernMostPoint = District.getNorthernMostPoint(this);
        if (lng < westernMostPoint[0] || lng > easternMostPoint[0] ||
            lat < southernMostPoint[1] || lat > northernMostPoint[1]) {
            return true;
        } else {
            return false;
        }
    }
}


function isUrban(point) {

    let southernDistrict = districts[9]; // District 10 is urban southernmost
    let southernMostPoint = District.getSouthernMostPoint(southernDistrict);
    let easternMostPoint = District.getEasternMostPoint(southernDistrict);

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
    let westernMostPoint = District.getWesternMostPoint(easternDistrict);




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
    let easternMostPoint = District.getEasternMostPoint(northernDistrict);

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

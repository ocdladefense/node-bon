// Define districts by region
const urban = [10, 11, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52];
const southernOregon = [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 56];
const easternOregon = [53, 54, 55, 57, 58, 59, 60]; // Add districts as needed







export let districts = [];








export default class District {
    constructor(coords) {

    this.coords = coords;
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

export function isUrban(point) {

    let southernDistrict = districts[9]; // District 10 is urban southernmost
    let southernMostPoint = southernDistrict.getSouthernMostPoint();
    let easternMostPoint = southernDistrict.getEasternMostPoint();

    if (point.lat() >= southernMostPoint[1] && point.lng() <= easternMostPoint[0]) {
        return true;
    } else {
        return false;
    }
}

export function isEasternOregon(point) {

    let easternDistrict = districts[54]; // Example: District 55 is in Eastern Oregon
    let westernMostPoint = easternDistrict.getWesternMostPoint();




    if (point.lng() > westernMostPoint[0]) {
        return true;
    } else {
        return false;
    }
}

export function isSouthernOregon(point) {
    return true;
}

// Determine starting quadrant based on address location
export function getStartQuadrant(point)
{
    // TODO: Return array of district objects
    if (isUrban(point)) {
        return urban;
    } else if (isEasternOregon(point)) {
        return easternOregon;
    } else {
        return southernOregon;
    }
}

export function remainingDistricts(startQuadrant)
{
    return urban.concat(southernOregon, easternOregon).filter(d => !startQuadrant.includes(d));
}
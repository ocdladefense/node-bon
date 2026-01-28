

const THE_DIVIDE = -121.443;


// Create a function that can test for whether a point is in Eastern Oregon.
// There are only 6 districts here.
function getIsEasternOregonTest(longitude) {

    return function(latLng) {
        return latLng[1] >= THE_DIVIDE;
    }
}


const isEasternOregon = getIsEasternOregonTest(THE_DIVIDE);




class District {

    id;

    coords;

    // The northernmost point of the district.
    northPoint;

    // The southernmost point of the district.
    southPoint;

    // The westernmost point of the district.
    westPoint;

    // The easternmost point of the district.
    eastPoint;

    // The coordinates as a Google KML Polygon.
    googleKmlPolygon;


    constructor(id, coords) {
        this.id = id;
        this.coords = coords;
        this.googleKmlPolygon = District.getAsGoogleKmlPolygon(coords);
        this.northPoint = District.getNorthernmostPoint(coords);
        this.southPoint = District.getSouthernmostPoint(coords);
        this.westPoint = District.getWesternmostPoint(coords);
        this.eastPoint = District.getEasternmostPoint(coords);
    }



    isOutside(latLng) {

        let lat = latLng[0];
        let lng = latLng[1];

        // If the point if north of the northernmost point or south of the southernmost point,
        // it can't be within this district.
        return lat > this.northPoint[0] || lat < this.southPoint[0] || lng < this.westPoint[1] || lng > this.eastPoint[1];
    }



    static getAsGoogleKmlPolygon(coords) {
        return coords.map(coord => {
            return { lat: coord[1], lng: coord[0] };
        });
    }



    static getNorthernmostPoint(coords) {

        const findMaxLatitudePoint = (accumulator, currentValue) => {
            let [lng, lat] = currentValue;
            let [accLng, accLat] = accumulator;
            return lat > accLat ? currentValue : accumulator;
        };

        let rfc7946coords = coords.reduce(findMaxLatitudePoint);

        return [rfc7946coords[1], rfc7946coords[0]];
    }


    static getSouthernmostPoint(coords) {

        const findMinLatitudePoint = (accumulator, currentValue) => {
            let [lng, lat] = currentValue;
            let [accLng, accLat] = accumulator;
            return lat < accLat ? currentValue : accumulator;
        };

        let rfc7946coords = coords.reduce(findMinLatitudePoint);

        return [rfc7946coords[1], rfc7946coords[0]];
    }


    static getWesternmostPoint(coords) {

        const findMinLongitudePoint = (accumulator, currentValue) => {
            let [lng, lat] = currentValue;
            let [accLng, accLat] = accumulator;
            return lng < accLng ? currentValue : accumulator;
        };

        let rfc7946coords = coords.reduce(findMinLongitudePoint);

        return [rfc7946coords[1], rfc7946coords[0]];
    }

    static getEasternmostPoint(coords) {

        const findMaxLongitudePoint = (accumulator, currentValue) => {
            let [lng, lat] = currentValue;
            let [accLng, accLat] = accumulator;
            return lng > accLng ? currentValue : accumulator;
        };

        let rfc7946coords = coords.reduce(findMaxLongitudePoint);

        return [rfc7946coords[1], rfc7946coords[0]];
    }



    static intersect(arr1, arr2) {
        // The filter() method creates a new array with all elements 
        // that pass the test implemented by the provided function.
        const commonElements = arr1.filter(element => {
            // The includes() method determines whether an array 
            // includes a certain value among its entries, returning true or false.
            return arr2.includes(element);
        });

        return commonElements;
    }



}


module.exports = District;

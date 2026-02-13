export default class Address {

    
    address; // Original address string
    location; // { lat: number, lng: number } - LatLng object
    district; // District object this address belongs to
    formattedAddress = null; // Cached formatted address from reverse geocoding

    constructor(address, location, district) {
        this.address = address; // Store original address string
        this.location = location; // Store LatLng object
        this.district = district; // Store reference to the district this address belongs to
    }

    // Getters for convenience
    get districtId() {
        return this.district.id;
    }

    // Get formatted address (with caching)
    async getFormattedAddress() {
        // Return cached formatted address if available
        if (this.formattedAddress) {
            return this.formattedAddress;
        }

        try {
            // Perform reverse geocoding to get formatted address
            this.formattedAddress = await Address.reverseGeocode(
                this.location.lat(),
                this.location.lng()
            );
            return this.formattedAddress;
        } catch (error) {
            console.error('Reverse geocoding failed:', error);
            return this.address; // Fallback to original input
        }
    }

    // Static method to geocode an address string to LatLng
    static async geocode(addressString) {
        const geocoder = new google.maps.Geocoder();
        // Wrap the geocoding in a Promise to use async/await
        return await new Promise((resolve, reject) => {
            // Geocode the address string
            geocoder.geocode({ address: addressString }, (results, status) => {
                if (status === 'OK') {
                    resolve(results[0].geometry.location);
                } else {
                    reject('Geocode failed: ' + status);
                }
            });
        });
    }

    // Static method to reverse geocode LatLng to formatted address
    static async reverseGeocode(lat, lng) {
        const geocoder = new google.maps.Geocoder();
        const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };
        return await new Promise((resolve, reject) => {
            geocoder.geocode({ location: latlng }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    resolve(results[0].formatted_address);
                } else {
                    reject('Reverse geocode failed: ' + status);
                }
            });
        });
    }

    // Create an Address by geocoding an address string
    static async fromString(addressString, district) {
        const location = await Address.geocode(addressString);
        return new Address(addressString, location, district);
    }
}

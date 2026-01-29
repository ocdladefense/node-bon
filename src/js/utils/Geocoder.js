


import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});
const API_KEY = "AIzaSyCfWNi-jamfXgtp5iPBLn63XV_3u5RJK0c";

export default class Geocoder {
    static async geocodeAddress(address) {

        return await client.geocode({
            params: {
                address: address,
                key: API_KEY //process.env.GOOGLE_MAPS_API_KEY, // Use environment variables for security
            },
            timeout: 1000, // milliseconds
        })
            .then((response) => {
                return response.data.results[0].geometry.location;;
            })
            .catch((error) => {
                console.error(error);
                return null;
            });



    }

}


// module.exports = Geocoder;

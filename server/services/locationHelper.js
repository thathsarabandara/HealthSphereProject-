const axios = require('axios');

async function getLocationFromIP(ip) {
    try {
        const response = await axios.get(`https://ipapi.co/${ip}/json/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching location data:', error);
        return null;
    }
}

module.exports = { getLocationFromIP };

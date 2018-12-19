const axios = require("axios");
const constructPolygon = require("./constructPolygon").default;
const logger = require("./logger").default;

const { REACT_APP_MAPBOX_ACCESS_TOKEN } = process.env;

const geoCode = async city => {
  try {
    const response = await axios.get(`${encodeURIComponent(city)}.json`, {
      baseURL: "https://api.mapbox.com/geocoding/v5/mapbox.places/",
      params: {
        access_token: REACT_APP_MAPBOX_ACCESS_TOKEN,
        types: "place",
        limit: 1
      }
    });

    logger.info(response.data);

    return {
      ...response.data,
      features: [...response.data.features, constructPolygon(response.data)]
    };
  } catch (error) {
    logger.error(error);
  }
};

exports.default = geoCode;

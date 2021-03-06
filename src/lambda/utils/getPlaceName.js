const startCase = require("lodash/startCase");
const toLower = require("lodash/toLower");

const getPlaceName = (placeUrl = "") => {
  const urlParts = placeUrl.split("/");
  if (urlParts[3] && urlParts[2]) {
    const city = startCase(toLower(urlParts[3]));
    const country = startCase(toLower(urlParts[2]));


    return {
      name: `${city}, ${country}`.replace(/-/g, " "),
      city,
      country,
    };
  }
};

exports.default = getPlaceName;

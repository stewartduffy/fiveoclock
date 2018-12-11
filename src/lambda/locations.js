const _ = require("lodash");
const moment = require("moment");
const axios = require("axios");
const cheerio = require("cheerio");
const bboxPolygon = require("@turf/bbox-polygon").default;

const { REACT_APP_MAPBOX_ACCESS_TOKEN } = process.env;

const processDates = cities => {
  return _(cities)
    .filter(({ time }) => {
      const isFive = time.indexOf("5:") > 0;
      const isPm = time.indexOf(" p") > 0;

      return isFive && isPm;
    })
    .map(({ name, time }) => {
      const cleanTime = time.replace("p.m.", "pm").replace("a.m.", "am");

      return {
        name,
        time,
        cleanTime,
        moment: moment(cleanTime, "ddd h.mm a").format(
          "dddd, MMMM Do YYYY, h:mm:ss a"
        )
      };
    })
    .value();
};

const constructPolygon = data => {
  const bBox = _.get(data, "features[0].bbox");
  if (bBox) {
    return bboxPolygon(bBox);
  }
};

async function getHtml() {
  const url = "https://www.timeanddate.com/worldclock/?sort=2&low=c";

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function geocode(city) {
  try {
    const response = await axios.get(`${encodeURIComponent(city)}.json`, {
      baseURL: "https://api.mapbox.com/geocoding/v5/mapbox.places/",
      params: {
        access_token: REACT_APP_MAPBOX_ACCESS_TOKEN,
        limit: 1
      }
    });

    return {
      ...response.data,
      features: [...response.data.features, constructPolygon(response.data)]
    };
  } catch (error) {
    console.error(error);
  }
}

exports.handler = async event => {
  const html = await getHtml();

  // if (!error && response.statusCode == 200) {
  const $ = cheerio.load(html);

  const cityNameElements = $(
    ".main-content-div .fixed table tbody tr td:not(.rbi)"
  );
  const cityTimeElements = $(".main-content-div .fixed table tbody tr td.rbi");

  const data = cityNameElements
    .map((i, el) => {
      const cityName = $(el).text(); // Select the cityName

      const cityTime = cityTimeElements[i]
        ? $(cityTimeElements[i]).text()
        : "No cityTime found"; // Select the cityTime

      return { name: cityName, time: cityTime };
    })
    .get();

  const filteredData = processDates(data);
  const firstCity = _.head(filteredData);

  const geoData = await geocode(firstCity.name);

  return {
    statusCode: 200,
    body: JSON.stringify(geoData)
  };
};

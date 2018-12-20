const sample = require("lodash/sample");
// const head = require("lodash/head");
const getHtml = require("./utils/getHtml").default;
const scrapeHtml = require("./utils/scrapeHtml").default;
const processDates = require("./utils/processDates").default;
const geoCode = require("./utils/geoCode").default;

exports.handler = async () => {
  const html = await getHtml();
  const data = scrapeHtml(html);
  const processedDates = processDates(data);
  const city = sample(processedDates);
  const geoData = await geoCode(city.name);

  return {
    statusCode: 200,
    body: JSON.stringify({
      geoJson: {
        ...geoData,
        name: city.name,
        placeData: city
      },
      places: processedDates
    })
  };
};

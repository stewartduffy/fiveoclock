const head = require("lodash/head");
const processDates = require("./utils/processDates").default;
const getHtml = require("./utils/getHtml").default;
const geoCode = require("./utils/geoCode").default;
const scrapeHtml = require("./utils/scrapeHtml").default;

exports.handler = async () => {
  const html = await getHtml();
  const data = scrapeHtml(html);
  const filteredData = processDates(data);
  const firstCity = head(filteredData);
  const geoData = await geoCode(firstCity.name);

  return {
    statusCode: 200,
    body: JSON.stringify({
      ...geoData,
      name: firstCity.name,
      placeData: firstCity
    })
  };
};

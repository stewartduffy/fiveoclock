const sample = require("lodash/sample");
const getHtml = require("./utils/getHtml").default;
const scrapeHtml = require("./utils/scrapeHtml").default;
const processDates = require("./utils/processDates").default;
const geoCode = require("./utils/geoCode").default;

exports.handler = async () => {
  const html = await getHtml();
  const data = scrapeHtml(html);
  const processedDates = processDates(data);
  //@TODO: ^^ Handle case when nowhere is 5! 1.30 NZ time summer time there is none. Either 4.30 or 6.30(ish)
  const city = sample(
    processedDates.data ? processedDates.data : processedDates
  );
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

const cheerio = require("cheerio");

const scrapeHtml = html => {
  const $ = cheerio.load(html);

  const cityNameElements = $(
    ".main-content-div .fixed table tbody tr td:not(.rbi)"
  );
  const cityTimeElements = $(".main-content-div .fixed table tbody tr td.rbi");

  const data = cityNameElements
    .map((i, el) => {
      const cityNameElement = $(el);

      const cityTime = cityTimeElements[i]
        ? $(cityTimeElements[i]).text()
        : "No cityTime found"; // Select the cityTime

      return { name: cityNameElement, time: cityTime };
    })
    .get();

  return data;
};

exports.default = scrapeHtml;

const flow = require("lodash/fp/flow");
const filter = require("lodash/fp/filter");
const isEmpty = require("lodash/isEmpty");
const map = require("lodash/fp/map");
const moment = require("moment");
const getPlaceName = require("./getPlaceName").default;

const isFive = cities => {
  return flow(
    filter(({ time }) => {
      const isFive = time.indexOf("5:") > 0;
      const isPm = time.indexOf(" p") > 0;

      return isFive && isPm;
    }),
    map(({ name, time }) => {
      const cleanTime = time.replace("p.m.", "pm").replace("a.m.", "am");

      return {
        time,
        cleanTime,
        ...getPlaceName(name.find("a").attr("href")),
        moment: moment(cleanTime, "ddd h.mm a").format(
          "dddd, MMMM Do YYYY, h:mm:ss a"
        )
      };
    })
  )(cities);
};

const isSix = cities => {
  return flow(
    filter(({ time }) => {
      const isFive = time.indexOf("6:") > 0;
      const isPm = time.indexOf(" p") > 0;

      return isFive && isPm;
    }),

    map(({ name, time }) => {
      const cleanTime = time.replace("p.m.", "pm").replace("a.m.", "am");

      return {
        time,
        cleanTime,
        ...getPlaceName(name.find("a").attr("href")),
        moment: moment(cleanTime, "ddd h.mm a").format(
          "dddd, MMMM Do YYYY, h:mm:ss a"
        )
      };
    })
  )(cities);
};

const processDates = cities => {
  const placesAreFive = isFive(cities);

  if (isEmpty(placesAreFive)) {
    return {
      isSix: true,
      data: isSix(cities)
    };
  }

  return placesAreFive;
};

exports.default = processDates;

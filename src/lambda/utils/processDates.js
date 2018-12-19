const flow = require("lodash/fp/flow");
const filter = require("lodash/fp/filter");
const map = require("lodash/fp/map");
const moment = require("moment");
const getPlaceName = require("./getPlaceName").default;

const processDates = cities => {
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
        name: getPlaceName(name.find("a").attr("href")),
        moment: moment(cleanTime, "ddd h.mm a").format(
          "dddd, MMMM Do YYYY, h:mm:ss a"
        )
      };
    })
  )(cities);
};

exports.default = processDates;

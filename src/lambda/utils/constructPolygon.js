const buffer = require("@turf/buffer").default;

const constructPolygon = FeatureCollection => {
  return buffer(FeatureCollection, 10, { units: "miles" });
};

exports.default = constructPolygon;

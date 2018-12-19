const buffer = require("@turf/buffer").default;

const constructPolygon = FeatureCollection => {
  return buffer(FeatureCollection, 1, { units: "miles" });
};

exports.default = constructPolygon;

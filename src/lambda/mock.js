const json = require("./mock.json");

exports.handler = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(json)
  };
};

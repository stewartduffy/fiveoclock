const axios = require("axios");

const getHtml = async () => {
  const url = "https://www.timeanddate.com/worldclock/?sort=2&low=c";

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

exports.default = getHtml;

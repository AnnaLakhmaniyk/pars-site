const cheerio = require("cheerio");
const axios = require("axios");

const getHtml = async (url) => {
  const link = url.startsWith("https://") ? url : `https://${url}`;

  const { data } = await axios.get(link);
  const htmlData = cheerio.load(data);

  return { htmlData, link };
};

module.exports = getHtml;

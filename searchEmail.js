const cheerio = require("cheerio");
const axios = require("axios");

let emailSet = new Set();

const getHtml = async (url) => {
  const link = url.startsWith("https://") ? url : `https://${url}`;

  const { data } = await axios.get(link);

  return cheerio.load(data);
};

const searchEmail = async (url) => {
  let nabor = [];

  const $ = await getHtml(url);

  $("a").each((i, elem) => {
    const allHref = `${$(elem).attr("href")}`;
    const href = allHref.replace(/\?.+/g, "");

    if (href === "undefined" || href.startsWith("tel:") || href.includes("#")) {
      return;
    }

    if (href.startsWith("mailto:")) {
      const indexEl = href.indexOf(":") + 1;
      emailSet.add(href.slice(indexEl));
      return;
    }

    if (href.startsWith("/")) {
      nabor.push(`${url}${href}`);
    } else {
      nabor.push(href);
    }
  });
  return nabor;
};

module.exports = {
  searchEmail,
  emailSet,
};

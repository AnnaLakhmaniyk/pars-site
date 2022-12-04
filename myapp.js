const cheerio = require("cheerio");
const axios = require("axios");

const arg = process.argv;
const a = arg[2];
// console.log(a);

const getHtml = async (url) => {
  const link = url.startsWith("https://") ? url : `https://${url}`;

  const { data } = await axios.get(link);

  return cheerio.load(data);
};

let arr = new Set();

const searchEmail = async (url) => {
  let nabor = [];

  const $ = await getHtml(url);

  $("a").each((i, elem) => {
    // const link = `${$(el).attr("href")}`;
    const href = `${$(elem).attr("href")}`;

    if (href === "undefined" || href.startsWith("tel:") || href.includes("#")) {
      return;
    }
    //.replace(/\?.+/g, "")
    if (href.startsWith("mailto:")) {
      const indexEl = href.indexOf(":") + 1;
      arr.add(href.slice(indexEl));
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

// const myLink = "comparus.de";
// const myLink = "desktopgames.com.ua";
const myLink = "madappgang.com";
let caunter = 2;

const parse = async (url) => {
  const elems = await searchEmail(url);

  async function search2link(dataArray) {
    console.log("хей я працюю", dataArray);
    if (caunter === 0) {
      console.log(arr);
      return;
    }

    const uniq = new Set(dataArray);
    const link = Array.from(uniq);

    const multipleRequest = await Promise.allSettled(
      link.map((item) => searchEmail(item))
    );

    const onlyFulfilled = multipleRequest.filter(
      (i) => i && i.status === "fulfilled"
    );

    const validData = onlyFulfilled
      .filter((i) => i.value && i.value.length !== 0)
      .map((i) => i.value);

    console.log(caunter);
    caunter -= 1;

    search2link(validData);
  }
  search2link(elems);

  // console.log(arr);
};

parse(a);

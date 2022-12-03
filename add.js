"use strict";
const cheerio = require("cheerio");
const axios = require("axios");

const getHtml = async (url) => {
  const link = url.startsWith("https://") ? url : `https://${url}`;
  const { data } = await axios.get(link);

  return cheerio.load(data);
};

let arr = new Set();

const searchEmail = async (url) => {
  let nabor = [];
  try {
    const $ = await getHtml(url);

    $("a").each((i, elem) => {
      const href = $(elem).attr("href").replace(/\?.+/g, "");

      if (href === undefined || href.startsWith("tel:") || href.includes("#")) {
        return;
      }

      if (href.startsWith("mailto:")) {
        const indexEl = href.indexOf(":") + 1;
        arr.add(href.slice(indexEl));
        return;
      }

      console.log(href);

      if (href.startsWith("/")) {
        nabor.push(`${url}${href}`);
      } else {
        nabor.push(href);
      }
    });
    return nabor;
  } catch (er) {
    console.log(er);
  }
};

const myLink = "comparus.de";
// const myLink = "https://www.visartech.com";
// const myLink = "madappgang.com";

const parse = async (url) => {
  const elems = await searchEmail(url);

  const uniq = new Set(elems);
  const link = Array.from(uniq);

  async function search2link(dataArray) {
    const multipleRequest = await Promise.all(
      dataArray.map((item) => searchEmail(item))
    );

    // console.log(multipleRequest.flat());
  }
  search2link(link);

  // console.log(arr);
};

parse(myLink);

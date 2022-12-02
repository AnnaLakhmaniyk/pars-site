"use strict";
const cheerio = require("cheerio");
const axios = require("axios");

const getHtml = async (url) => {
  const { data } = await axios.get(url);

  return cheerio.load(data);
};

let arr = new Set();

const searchEmail = async (url) => {
  let nabor = [];
  try {
    const $ = await getHtml(url);

    $("a").each((i, elem) => {
      const href = $(elem).attr("href");

      if (href === undefined || href.includes("tel") || href.includes("#")) {
        return;
      }

      if (href.includes("@" && "mailto")) {
        const indexEl = href.indexOf(":") + 1;
        arr.add(href.slice(indexEl));
        return;
      }
      const link = href.replace(/\?.+/g, "");

      if (link.indexOf("/") === 0) {
        nabor.push(`${url}${link}`);
      } else {
        nabor.push(link);
      }
    });

    return nabor;
  } catch (er) {
    console.log(er);
  }
};

// const myLink = "https://comparus.de";
// const myLink = "https://www.visartech.com";
const myLink = "https://madappgang.com";

const parse = async (url) => {
  const elems = await searchEmail(url);

  const uniq = new Set(elems);
  const link = Array.from(uniq);

  let res = [];
  for (let i = 0; i < link.length; i++) {
    const es = await searchEmail(link[i]);
    if (es !== undefined) {
      res = [...res, ...es];
    }
  }
  ///відкінуті силки з link2 якщо воні є в link
  //строка з //
  const res2 = new Set(res);
  const link2 = Array.from(res2);
  console.log(link);
  console.log(link2);

  // for (let i = 0; i < link2.length; i++) {
  //   const es = await searchEmail(link2[i]);
  // }

  // console.log(arr);
};

parse(myLink);

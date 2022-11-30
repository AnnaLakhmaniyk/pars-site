"use strict";
const cheerio = require("cheerio");
const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// const myAnsver = async () => {
//   let html;
//   try {
//     const resp = await axios.get("https://madappgang.com/");
//     html = resp.data;
//   } catch (e) {
//     console.log(e);
//   }

//   const dom = new JSDOM(html);
//   const document = dom.window.document;

//   const item = document.querySelectorAll("a[href]");
//   console.log(item.html());
// };

// myAnsver();

const parse = async () => {
  const getHtml = async (url) => {
    const { data } = await axios.get(url);
    return cheerio.load(data);
  };

  const $ = await getHtml("https://madappgang.com/");

  let nabor = new Set();
  let arr = new Set();
  $("a").each((i, elem) => {
    const href = $(elem).attr("href");

    if (href === undefined || href.includes("tel") || href.includes("#")) {
      return;
    }

    if (href.includes("@")) {
      const indexEl = href.indexOf(":") + 1;
      arr.add(href.slice(indexEl));
      return;
    }
    const link = href.replace(/\?.+/g, "");
    if (link.indexOf("/") === 0) {
      nabor.add(`https://madappgang.com${link}`);
    } else {
      nabor.add(link);
    }
  });
  console.log(arr);
  console.log(nabor);
};

parse();

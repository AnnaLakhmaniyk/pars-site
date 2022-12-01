"use strict";
const cheerio = require("cheerio");
const axios = require("axios");

const getHtml = async (url) => {
  const { data } = await axios.get(url);
  return cheerio.load(data);
};

const searchEmail = async (url) => {
  const test = {};
  let nabor = new Set({ ...test });

  let arr = new Set();

  try {
    const $ = await getHtml(url);

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
        test.add(`${url}${link}`);
      } else {
        test.add(link);
      }
    });
    console.log(nabor, arr);

    // if (nabor.length) {
    //   for (const item of nabor) {
    //     searchEmail(item);
    //     nabor.delete(item);
    //   }
    // }

    return [nabor, arr];
  } catch (er) {
    console.log(er);
  }
};

// const myLink = "https://comparus.de";
const myLink = "https://www.visartech.com/";

const parse = async (url) => {
  const elems = await searchEmail(url);

  // for (const item of arryLink) {
  //   const request = await searchEmail(item);
  //   email.push(...request[1]);
  // }
  // for (const elem of arryLink2) {
  //   const request2 = await searchEmail(elem);
  //   email.push(...request2[1]);
  // }
  // }

  // console.log(new Set(email));
  // console.log(new Set(arryLink));
};

// const parsAll = () => {
//   let nabor = new Set();
//   let arr = new Set();
// };

parse(myLink);

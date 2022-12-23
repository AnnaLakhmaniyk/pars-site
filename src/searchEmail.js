const validator = require("email-validator");
const splitLink = require("./splitLink");
const getHtml = require("./getHtml");

let emailSet = new Set();

const searchEmail = async (url) => {
  let nabor = [];

  const $ = await getHtml(url);
  const link = $.link;

  $.htmlData("a").each((_, elem) => {
    const href = `${$.htmlData(elem).attr("href")}`;

    if (href === "undefined" || href.startsWith("tel:") || href.includes("#")) {
      return;
    }

    if (href === "undefined") {
      return;
    }
    if (href === "") {
      return;
    }
    if (href.startsWith("tel:")) {
      return;
    }
    if (
      href.startsWith("#") ||
      href.startsWith("/#") ||
      href.startsWith("//#")
    ) {
      return;
    }
    if (
      href === `${link}` ||
      href === `${link}/` ||
      href === link ||
      href === "/" ||
      href === "//" ||
      `https://${href}` === link
    ) {
      return;
    }

    if (href.startsWith("mailto:")) {
      const email = href.split(":")[1];
      if (validator.validate(email) === true) {
        emailSet.add(email);
        return;
      }
    }

    const [protocol, baseUrl] = splitLink(link);
    const allHref = href.replace(/\?.+/g, "");
    if (href.startsWith("/") || href.startsWith("//") || href.startsWith("?")) {
      nabor.push(`${protocol}//${baseUrl}${allHref}`);
    } else {
      nabor.push(allHref);
    }
  });
  return nabor;
};

module.exports = {
  searchEmail,
  emailSet,
};

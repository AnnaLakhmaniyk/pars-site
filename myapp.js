const data = require("./searchEmail");

const arg = process.argv;
const myLink = arg[2];

// const myLink = "comparus.de";
// const myLink = "desktopgames.com.ua";
// const myLink = "madappgang.com";

let caunter = 2;
const searchLinkSecondStep = async (linkArray) => {
  if (caunter === 0) {
    const email = [...data.emailSet].join("\n");
    console.log(email);
    return;
  }

  const link = [...new Set(linkArray)];

  const multipleRequest = await Promise.allSettled(
    link.map((item) => data.searchEmail(item))
  );

  const fulfilledAnswers = multipleRequest.filter(
    (i) => i && i.status === "fulfilled"
  );

  const validData = fulfilledAnswers
    .filter((i) => i.value && i.value.length !== 0)
    .map((i) => i.value);

  caunter -= 1;

  searchLinkSecondStep(validData);
};

const parser = async (url) => {
  const elems = await data.searchEmail(url);
  searchLinkSecondStep(elems);
};

parser(myLink);

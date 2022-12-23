const splitLink = (url) => {
  const splitedUrl = url.split("/");
  const protocol = splitedUrl[0];
  const baseUrl = splitedUrl.find((item) => item.includes("."));
  return [protocol, baseUrl];
};
module.exports = splitLink;

export default function parseCookies(req, res, next) {
  let cookieString = req.get("Cookie") || "";
  const parsedCookies = cookieString.split("; ").reduce((cookies, cookie) => {
    if (cookie.length) {
      let index = cookie.indexOf("=");
      let key = cookie.slice(0, index);
      let token = cookie.slice(index + 1);
      cookies[key] = token;
    }
    return cookies;
  }, {});

  if (!!parsedCookies['leftyPoncho'] && parsedCookies['leftyPoncho'] !== 'undefined') {
    req.session_id = parsedCookies['leftyPoncho'];
  }

  next();
}
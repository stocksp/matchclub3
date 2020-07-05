import CookieService from 'libs/cookie'

export default async (req, res) => {
  CookieService.removeAuthCookies(res);
  res.end();
};

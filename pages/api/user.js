import Iron from '@hapi/iron'
import CookieService from 'libs/cookie'

export default async (req, res) => {
  let user;
  try {
    console.log("api/user called")
    user = await Iron.unseal(CookieService.getAuthToken(req.cookies), process.env.ENCRYPTION_SECRET, Iron.defaults)
  } catch (error) {
    res.status(401).end()
  }

  // now we have access to the data inside of user
  // and we could make database calls or just send back what we have
  // in the token.

  res.json(user)
}
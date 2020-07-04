import Iron from '@hapi/iron'
import CookieService from 'libs/cookie'

export default async (req, res) => {
  let user;
  try {
    console.log("api/user called")
    user = await Iron.unseal(CookieService.getAuthToken(req.cookies), process.env.ENCRYPTION_SECRET, Iron.defaults)
  } catch (error) {
    console.log("catch error in user")
    res.finish = true;
    res.status(401).end()
    return;
  }

  // now we have access to the data inside of user
  // and we could make database calls or just send back what we have
  // in the token.
  console.log("user is", user)
  res.json(user)
}
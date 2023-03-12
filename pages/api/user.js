import Iron from "@hapi/iron";
import CookieService from "libs/cookie";
import { getTokenCookie } from 'libs/auth-cookies'

export default async (req, res) => {
  let user;
  try {
    console.log("api/user called");
    const token = getTokenCookie(req)
    //console.log("token", token);
    user = token && await Iron.unseal(
      token,
      process.env.ENCRYPTION_SECRET,
      Iron.defaults
    );
  } catch (error) {
    console.log("catch error in user", error.message);
    res.finish = true;
    res.status(401).end();
    return;
  }

  // now we have access to the data inside of user
  // and we could make database calls or just send back what we have
  // in the token.
  //console.log("user is", user);
  res.status(200).json({user : user || null});
};

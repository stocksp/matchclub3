import {Magic} from '@magic-sdk/admin'
import Iron from '@hapi/iron'
import CookieService from 'libs/cookie'

let magic = new Magic(process.env.MAGIC_SECRET_KEY)

export default async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  // exchange the DID from Magic for some user data
  const did = magic.utils.parseAuthorizationHeader(req.headers.authorization)
  const user = await magic.users.getMetadataByToken(did)

  // Author a couple of cookies to persist a users session
  // Author a couple of cookies to persist a user's session
  const token = await Iron.seal(user, process.env.ENCRYPTION_SECRET, Iron.defaults)
  CookieService.setTokenCookie(res, token)

  res.end();
};

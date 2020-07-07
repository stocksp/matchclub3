import { removeTokenCookie } from 'libs/auth-cookies'
import { getSession } from 'libs/auth-cookies'
import { magic } from 'libs/magic'

export default async (req, res) => {
  const session = await getSession(req)
  await magic.users.logoutByIssuer(session.issuer)
  removeTokenCookie(res)
  res.writeHead(302, { Location: '/' })
  res.end()
};

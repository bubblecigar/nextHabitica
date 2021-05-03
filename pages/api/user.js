import { getLoginSession } from '../../lib/auth'
import { findUser } from '../../lib/user'

export const getUserFromLoginSession = async (req) => {
  const session = await getLoginSession(req)
  const user = (session && (await findUser({ username: session.user_name}))) ?? null
  return user
}

export default async function user(req, res) {
  try {
    const user = await getUserFromLoginSession(req)
    res.status(200).json({ user })
  } catch (error) {
    res.status(500).end('Authentication token is invalid, please log in')
  }
}

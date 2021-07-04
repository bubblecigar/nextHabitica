import { readEatRows } from '../../eat/read'

export default async function read(req, res) {
  try {
    const { friendId } = req.body
    const result = await readEatRows(friendId)
    res.status(200).send(result.rows)
  } catch (error) {
    console.log('api/friend/data/eat error:', error)
    res.status(500).end(error)
  }
}

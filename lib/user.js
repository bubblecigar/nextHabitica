import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import db from '../db/index.js'

const createUserInDB = async user => {
  const { id, username, hash, salt } = user

  return new Promise((resolve, reject) => {
    db.query(`
    INSERT INTO entries(user_id, user_name, hash, salt)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `, [id, username, hash, salt], (err, dbRes) => {
      if (err) {
        console.log('createUserInDB err:', err)
        reject(err)
      } else {
        resolve(dbRes)
      }
    })
  })
}

export async function createUser ({ username, password }) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex')
  const user = {
    id: uuidv4(),
    username,
    hash,
    salt
  }

  const dbRes = await createUserInDB(user)
  return dbRes
}

export async function findUser ({ username }) {
  return new Promise(
    (resolve, reject) => {
      db.query(`
      SELECT * FROM entries WHERE user_name=$1
    `, [username], (err, dbRes) => {
        if (err) {
          console.log('findUser err:', err)
          // error handling
          reject(err)
        } else if (!dbRes.rows.length) {
          reject(new Error('unregistered username'))
        } else {
        // success
          resolve(dbRes.rows[0])
        }
      })
    }
  )
}

export function validatePassword (user, inputPassword) {
  const inputHash = crypto
    .pbkdf2Sync(inputPassword, user.salt, 1000, 64, 'sha512')
    .toString('hex')
  const passwordsMatch = user.hash === inputHash

  return passwordsMatch
}

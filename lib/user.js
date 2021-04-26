import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import db from '../db/index.js'

const createUserInDB = user => {
  const { id, username, hash, salt } = user

  db.query(`
    INSERT INTO entries(user_id, user_name, hash, salt)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [id, username, hash, salt], (err, dbRes) => {
    if (err) {
      console.log('createUserInDB err:', err)
      // error handling
    } else {
      // success
    }
  })
}

export function createUser ({ username, password }) {
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

  createUserInDB(user)
}

// // Here you should lookup for the user in your DB
// export async function findUser ({ username }) {
//   // This is an in memory store for users, there is no data persistence without a proper DB
//   return { username: 'bubblecigar', password: '0000' }
//   return users.find((user) => user.username === username)
// }

// // Compare the password of an already fetched user (using `findUser`) and compare the
// // password for a potential match
// export function validatePassword (user, inputPassword) {
//   // const inputHash = crypto
//   //   .pbkdf2Sync(inputPassword, user.salt, 1000, 64, 'sha512')
//   //   .toString('hex')
//   // const passwordsMatch = user.hash === inputHash
//   console.log('validatePassword')
//   return true
//   return passwordsMatch
// }

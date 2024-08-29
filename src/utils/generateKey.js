/* eslint-disable indent */
import crypto from 'node:crypto'

const generateKey = () => {
  const privateKey = crypto.randomBytes(64).toString('hex')
  const publicKey = crypto.randomBytes(64).toString('hex')

  return {
    privateKey,
    publicKey
  }
}

export default generateKey

import jwt from 'jsonwebtoken'

const generateToken = (user, tokenSecret, tokenLife) => {
  const data = {
    _id: user._id,
    admin: user.admin
  }
  return jwt.sign(data, tokenSecret, { expiresIn: tokenLife })

}

const verifyToken = (token, secretKey) => {
  return jwt.verify(token, secretKey)
}

export const jwtHelper = {
  generateToken,
  verifyToken
}
import jwt from 'jsonwebtoken'

const generateToken = ({ user, tokenSecret, tokenLife, exp }) => {
  const data = {
    _id: user._id,
    admin: user.admin
  }
  if (exp) {
    return jwt.sign({ exp, ...data }, tokenSecret)
  } else {
    return jwt.sign(data, tokenSecret, { expiresIn: tokenLife })
  }
}

const verifyToken = (token, secretKey) => {
  return jwt.verify(token, secretKey)
}

export const jwtHelper = {
  generateToken,
  verifyToken
}
import { StatusCodes } from 'http-status-codes'
import { jwtHelper } from '~/helpers/jwt.helper'
import { authModel } from '~/models/authModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import findKeyTokenById from '~/utils/findKeyTokenById'


const tokenDecode = async (token) => {
  const keyStore = await findKeyTokenById(token)
  try {
    const decoded = jwtHelper.verifyToken(token, keyStore.publicKey)
    return decoded
  } catch (err) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, { name: 'EXPIRED_TOKEN', message: 'Token hết hạn' })
  }
}

const refreshTokenDecode = async (token) => {
  const keyStore = await findKeyTokenById(token)

  try {
    const decoded = jwtHelper.verifyToken(token, keyStore.privateKey)
    return decoded
  } catch {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Bạn không được phép truy cập')
  }
}

const auth = async (req, res, next) => {
  try {
    const access_token = req.headers['authorization']?.replace('Bearer ', '')
    if (access_token) {
      const tokenDecoded = await tokenDecode(access_token)
      const getAccessToken = await authModel.getAccessToken(access_token)
      if (!getAccessToken) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Không tìm thấy token')
      const user = await userModel.getInfo(tokenDecoded._id)
      if (!user) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Không tìm thấy user')
      }
      const { _id, admin } = tokenDecoded
      req.user = { _id, admin }
      next()
    } else {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token không được gửi')
    }
  } catch (error) {
    next(error)
  }
}

export default { auth, tokenDecode, refreshTokenDecode }
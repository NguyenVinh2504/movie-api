import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { jwtHelper } from '~/helpers/jwt.helper'
import { authModel } from '~/models/authModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'


const tokenDecode = async (token) => {
  try {
    const decoded = jwtHelper.verifyToken(token, env.ACCESS_TOKEN_SECRET)
    return decoded
  } catch {
    return false
  }
}

const auth = async (req, res, next) => {
  try {
    const access_token = req.headers['authorization']?.replace('Bearer ', '')
    if (access_token) {
      const tokenDecoded = await tokenDecode(access_token)
      if (!tokenDecoded) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Bạn không được phép truy cập')
      }
      const getAccessToken = await authModel.getAccessToken(access_token)
      if (!getAccessToken) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Không tìm thấy token')
      const user = await userModel.getInfo(tokenDecoded._id)
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy user')
      }
      const { _id, admin } = tokenDecoded
      req.user = { _id, admin }
      next()
    } else {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Token Không Được Gửi')
    }
  } catch (error) {
    next(error)
  }
}

export default { auth, tokenDecode }
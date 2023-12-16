import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { jwtHelper } from '~/helpers/jwt.helper'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'


const tokenDecode = (req) => {
  try {
    const bearerHeader = req.headers['authorization']
    if (bearerHeader) {
      const token = bearerHeader.split(' ')[1]

      return jwtHelper.verifyToken(token, env.ACCESS_TOKEN_SECRET)
    }
    return false
  } catch {
    return false
  }
}

const auth = async (req, res, next) => {
  try {
    const tokenDecoded = tokenDecode(req)
    if (!tokenDecoded) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Bạn không được phép truy cập')
    }

    const user = await userModel.getInfo(tokenDecoded._id)

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy user')
    }
    const { _id, admin } = tokenDecoded
    req.user = { _id, admin }
    next()
  } catch (error) {
    next(error)
  }
}

export default { auth, tokenDecode }
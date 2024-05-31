import { StatusCodes } from 'http-status-codes'
import { jwtHelper } from '~/helpers/jwt.helper'
import { authModel } from '~/models/authModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import findKeyTokenById from '~/utils/findKeyTokenById'


const tokenDecode = async (token) => {
  // Tìm publicKey trong db của user vửa gửi lên bằng token
  const keyStore = await findKeyTokenById(token)
  try {
    // Verify bằng publicKey vừa lấy trong db
    const decoded = jwtHelper.verifyToken(token, keyStore.publicKey)
    return decoded
  } catch (err) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, { name: 'EXPIRED_TOKEN', message: 'Token hết hạn' })
  }
}

const refreshTokenDecode = async (req, res, next) => {
  try {
    //Lấy token user gửi lên
    const refreshToken = req.body.refreshToken
    if (!refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh Token không được gửi')
    }
    req.refreshToken = refreshToken

    // Tìm privateKey trong db của user vửa gửi lên bằng token
    const keyStore = await findKeyTokenById(refreshToken)
    req.keyStore = keyStore

    try {
      // Verify bằng privateKey vừa lấy trong db
      const decoded = jwtHelper.verifyToken(refreshToken, keyStore.privateKey)
      req.decoded = decoded
    } catch {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Bạn không được phép truy cập')
    }
    next()
  }
  catch (error) {
    next(error)
  }
}

const auth = async (req, res, next) => {
  try {
    const access_token = req.headers['authorization']?.replace('Bearer ', '')
    if (access_token) {
      // Kiểm tra accessToken user gửi lên
      const tokenDecoded = await tokenDecode(access_token)

      // Kiểm tra accessToken có trong db không
      const getAccessToken = await authModel.getAccessToken(access_token)
      if (!getAccessToken) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Không tìm thấy token')

      // Kiểm tra user có trong db không
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
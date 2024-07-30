import { StatusCodes } from 'http-status-codes'
import { jwtHelper } from '~/helpers/jwt.helper'
import { authModel } from '~/models/authModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import findKeyTokenById from '~/utils/findKeyTokenById'


const tokenDecode = async (token, next) => {
  try {
    // Tìm publicKey trong db của user vửa gửi lên bằng token
    const keyStore = await findKeyTokenById(token)
    // Verify bằng publicKey vừa lấy trong db
    const decoded = jwtHelper.verifyToken(token, keyStore.publicKey)
    return decoded
  } catch (err) {
    if (err.message.includes('jwt expired')) {
      next(new ApiError(StatusCodes.UNAUTHORIZED, { name: 'EXPIRED_TOKEN', message: 'Token hết hạn' }))
    }
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Bạn không được phép truy cập'))
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
    const decoded = jwtHelper.verifyToken(refreshToken, keyStore.privateKey)
    req.decoded = decoded
    next()
  }
  catch (error) {
    if (error.message.includes('jwt malformed')) {
      next(new ApiError(StatusCodes.UNAUTHORIZED, 'Bạn không được phép truy cập'))
    }
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Có lỗi xảy ra trong quá trình xử lý'))
  }
}

const auth = async (req, res, next) => {
  const access_token = req.headers['authorization']?.replace('Bearer ', '')
  if (!access_token) next(new ApiError(StatusCodes.UNAUTHORIZED, 'Token không được gửi'))
  try {
    const [tokenDecoded, getAccessToken] = await Promise.all([
      // Kiểm tra accessToken user gửi lên
      tokenDecode(access_token, next),

      // Kiểm tra accessToken có trong db không
      authModel.getAccessToken(access_token)
    ])

    if (!getAccessToken) next(new ApiError(StatusCodes.UNAUTHORIZED, 'Không tìm thấy token'))

    // Kiểm tra user có trong db không
    const user = await userModel.getInfo(tokenDecoded._id)
    if (!user) {
      next(new ApiError(StatusCodes.UNAUTHORIZED, 'Không tìm thấy user'))
    }
    const { _id, admin } = tokenDecoded
    req.user = { _id, admin }
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Có lỗi trong quá trình xác thực'))
  }
}

export default { auth, tokenDecode, refreshTokenDecode }
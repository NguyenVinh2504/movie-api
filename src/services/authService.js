/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
import { userModel } from '~/models/userModel'
import { slugify } from '~/utils/formatters'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import hashPassword from '~/utils/hashPassword'
import validationsPassword from '~/utils/validationsPassword'
import { jwtHelper } from '~/helpers/jwt.helper'
import { authModel } from '~/models/authModel'

const signUp = async (req, res) => {
  try {
    const checkUser = await userModel.getUserName(req.body.name)
    if (checkUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Đã có người dùng này')
    // Mã hóa mật khẩu từ phía người dùng nhập vào
    const hashed = await hashPassword(req.body.password)
    // Lấy ra tất cả dữ liệu từ người dùng trừ confirmPassword
    const { confirmPassword, ...option } = req.body

    // Xử lí dữ liệu của người dùng và thêm vào một số thông tin khác
    const newUser = {
      ...option,
      password: hashed,
      slug: slugify(req.body.name),
      userName: slugify(req.body.name).replace('-', '')
    }

    // Truyền dữ liệu đã xử lí vào model
    const user = await authModel.signUp(newUser)

    // Tạo token
    const token = jwtHelper.generateToken(user, env.ACCESS_TOKEN_SECRET, '1h')
    const refreshToken = jwtHelper.generateToken(user, env.REFRESH_TOKEN_SECRET, '365d')
    await authModel.addRefreshToken({ refreshToken })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      path: '/',
      // maxAge: 31557600000,
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      sameSite: 'Lax'
    })
    return {
      token,
      ...user
    }
  } catch (error) {
    throw error
  }
}

const loginGoogle = async (req, res) => {
  try {
    const checkUser = await userModel.getUserName(req.body.name)
    if (checkUser) {
      const token = jwtHelper.generateToken(checkUser, env.ACCESS_TOKEN_SECRET, '1h')
      const refreshToken = jwtHelper.generateToken(checkUser, env.REFRESH_TOKEN_SECRET, '365d')
      await authModel.addRefreshToken({ refreshToken })
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        path: '/',
        // maxAge: 31557600000,
        expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        sameSite: 'Lax'
      })
      const { name, ...rest } = checkUser
      const [splitName] = name.split('_')
      return {
        token,
        name: splitName,
        ...rest
      }
    } else {
      // Mã hóa mật khẩu từ phía người dùng nhập vào
      const hashed = await hashPassword(req.body.password)
      // Lấy ra tất cả dữ liệu từ người dùng trừ confirmPassword
      const { confirmPassword, ...option } = req.body

      // Xử lí dữ liệu của người dùng và thêm vào một số thông tin khác
      const [splitName] = req.body.name.split('_')
      const newUser = {
        ...option,
        password: hashed,
        slug: slugify(splitName),
        userName: slugify(splitName).replace('-', '')
      }

      // Truyền dữ liệu đã xử lí vào model
      const user = await authModel.signUp(newUser)
      const { name, ...rest } = user
      // Tạo token
      const token = jwtHelper.generateToken(user, env.ACCESS_TOKEN_SECRET, '1h')
      const refreshToken = jwtHelper.generateToken(user, env.REFRESH_TOKEN_SECRET, '365d')
      await authModel.addRefreshToken({ refreshToken })
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        path: '/',
        // maxAge: 31557600000,
        expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        sameSite: 'Lax'
      })
      return {
        token,
        name: splitName,
        ...rest
      }
    }
  } catch (error) {
    throw error
  }
}

const login = async (req, res) => {
  try {
    const user = await userModel.getUserName(req.body.name)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Nhập sai người dùng')
    }
    const validations = await validationsPassword({
      id: user._id,
      password: req.body.password
    })

    if (!validations) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Nhập sai mật khẩu')
    }
    user.password = undefined
    if (user && validations) {
      const token = jwtHelper.generateToken(user, env.ACCESS_TOKEN_SECRET, '1h')
      const refreshToken = jwtHelper.generateToken(user, env.REFRESH_TOKEN_SECRET, '365d')
      await authModel.addRefreshToken({ refreshToken })
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        path: '/',
        // maxAge: 31557600000,
        expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        sameSite: 'Lax'
      })
      return {
        ...user,
        token
      }
    }


  } catch (error) {
    throw error
  }
}

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Không được phép')
    }
    const tokenDecoded = jwtHelper.verifyToken(refreshToken, env.REFRESH_TOKEN_SECRET)
    if (!tokenDecoded) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Bạn không được phép truy cập')
    }
    const checkToken = await authModel.getRefreshToken(refreshToken)
    if (!checkToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh Token không hợp lệ')
    }
    await authModel.deleteRefreshToken(refreshToken)
    const newAccessToken = jwtHelper.generateToken(tokenDecoded, env.ACCESS_TOKEN_SECRET, '1h')
    const newRefreshToken = jwtHelper.generateToken(tokenDecoded, env.REFRESH_TOKEN_SECRET, '365d')
    await authModel.addRefreshToken({ refreshToken: newRefreshToken })
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      path: '/',
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      sameSite: 'Lax'
    })
    return newAccessToken
  } catch (error) {
    throw error
  }
}
const logout = async (req, res) => {
  try {
    res.clearCookie('refreshToken')
    await authModel.deleteRefreshToken(req.cookies.refreshToken)
  }
  catch (error) {
    throw error
  }
}
export const authService = {
  signUp,
  loginGoogle,
  login,
  refreshToken,
  logout
}
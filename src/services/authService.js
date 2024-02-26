/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
import { userModel } from '~/models/userModel'
import { formatUserName, slugify } from '~/utils/formatters'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import hashPassword from '~/utils/hashPassword'
import validationsPassword from '~/utils/validationsPassword'
import { jwtHelper } from '~/helpers/jwt.helper'
import { authModel } from '~/models/authModel'

const signUp = async (req, res) => {
  try {
    const checkEmail = await userModel.getEmail(req.body.email)
    if (checkEmail) throw new ApiError(StatusCodes.BAD_REQUEST, 'ISEXISTS')
    // Mã hóa mật khẩu từ phía người dùng nhập vào
    const hashed = await hashPassword(req.body.password)
    // Lấy ra tất cả dữ liệu từ người dùng trừ confirmPassword
    const { confirmPassword, ...option } = req.body

    // Xử lí dữ liệu của người dùng và thêm vào một số thông tin khác
    const newUser = {
      ...option,
      password: hashed,
      slug: slugify(req.body.name),
      userName: `@${formatUserName(req.body.name)}`,
      temporaryAvatar: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${formatUserName(req.body.name)}`
    }

    // Truyền dữ liệu đã xử lí vào model
    const user = await authModel.signUp(newUser)

    // Tạo token
    const accessToken = jwtHelper.generateToken(user, env.ACCESS_TOKEN_SECRET, '0.5h')
    const refreshToken = jwtHelper.generateToken(user, env.REFRESH_TOKEN_SECRET, '365d')
    await authModel.addRefreshToken({ userId: user._id.toString(), refreshToken })
    await authModel.addAccessToken({ userId: user._id.toString(), accessToken })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      path: '/',
      // maxAge: 31557600000,
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      sameSite: 'Lax'
    })
    user.password = undefined
    return {
      accessToken,
      refreshToken,
      ...user
    }
  } catch (error) {
    throw error
  }
}

const loginGoogle = async (req, res) => {
  try {
    const checkEmail = await userModel.getEmail(req.body.email)
    // if (checkEmail) throw new ApiError(StatusCodes.BAD_GATEWAY, 'Email đã được sử dụng. Vui lòng đăng nhập với mật khẩu hoặc sử dụng email khác')
    if (checkEmail) {
      const accessToken = jwtHelper.generateToken(checkEmail, env.ACCESS_TOKEN_SECRET, '0.5h')
      const refreshToken = jwtHelper.generateToken(checkEmail, env.REFRESH_TOKEN_SECRET, '365d')
      await authModel.addRefreshToken({ userId: checkEmail._id.toString(), refreshToken })
      await authModel.addAccessToken({ userId: checkEmail._id.toString(), accessToken })
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        path: '/',
        expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        sameSite: 'Lax'
      })
      return {
        accessToken,
        refreshToken,
        ...checkEmail
      }
    } else {
      // Mã hóa mật khẩu từ phía người dùng nhập vào
      const hashed = await hashPassword(req.body.password)
      // Lấy ra tất cả dữ liệu từ người dùng trừ confirmPassword
      const { name, confirmPassword, avatar, ...option } = req.body
      // Xử lí dữ liệu của người dùng và thêm vào một số thông tin khác
      const newUser = {
        name,
        temporaryAvatar: avatar,
        ...option,
        password: hashed,
        slug: slugify(name),
        userName: `@${formatUserName(name)}`
      }

      // Truyền dữ liệu đã xử lí vào model
      const user = await authModel.signUp(newUser)
      // Tạo accessToken
      const accessToken = jwtHelper.generateToken(user, env.ACCESS_TOKEN_SECRET, '0.5h')
      const refreshToken = jwtHelper.generateToken(user, env.REFRESH_TOKEN_SECRET, '365d')
      await authModel.addRefreshToken({ userId: user._id.toString(), refreshToken })
      await authModel.addAccessToken({ userId: checkEmail._id.toString(), accessToken })
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        path: '/',
        // maxAge: 31557600000,
        expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        sameSite: 'Lax'
      })
      user.password = undefined
      return {
        accessToken,
        refreshToken,
        ...user
      }
    }
  } catch (error) {
    throw error
  }
}

const login = async (req, res) => {
  try {
    const user = await userModel.getEmail(req.body.email)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'INVALID_EMAIL')
    }
    const validations = await validationsPassword({
      id: user._id,
      password: req.body.password
    })

    if (!validations) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'INVALID_PASSWORD')
    }
    user.password = undefined
    if (user && validations) {
      const accessToken = jwtHelper.generateToken(user, env.ACCESS_TOKEN_SECRET, '0.5h')
      const refreshToken = jwtHelper.generateToken(user, env.REFRESH_TOKEN_SECRET, '365d')
      await authModel.addRefreshToken({ userId: user._id.toString(), refreshToken })
      await authModel.addAccessToken({ userId: user._id.toString(), accessToken })
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
        accessToken,
        refreshToken
      }
    }
  } catch (error) {
    throw error
  }
}

const refreshToken = async (req, res) => {
  try {
    // const refreshToken = req.cookies.refreshToken
    const refreshToken = req.body.refreshToken
    const access_token = req.headers['authorization']?.replace('Bearer ', '')
    if (!refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh Token không được gửi')
    }

    const tokenDecoded = jwtHelper.verifyToken(refreshToken, env.REFRESH_TOKEN_SECRET)
    if (!tokenDecoded) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Bạn không được phép truy cập')
    }
    const checkToken = await authModel.getRefreshToken(refreshToken)
    if (!checkToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Không tìm thấy Refresh Token')
    }
    await authModel.deleteRefreshToken(refreshToken)
    await authModel.deleteAccessToken(access_token)
    const newAccessToken = jwtHelper.generateToken(tokenDecoded, env.ACCESS_TOKEN_SECRET, '0.5h')
    const newRefreshToken = jwtHelper.generateToken(tokenDecoded, env.REFRESH_TOKEN_SECRET, '365d')
    await authModel.addRefreshToken({ userId: tokenDecoded._id, refreshToken: newRefreshToken })
    await authModel.addAccessToken({ userId: tokenDecoded._id, accessToken: newAccessToken })
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      path: '/',
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      sameSite: 'Lax'
    })
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  } catch (error) {
    throw error
  }
}
const logout = async (req, res) => {
  try {
    res.clearCookie('refreshToken')
    await authModel.deleteRefreshToken(req.cookies.refreshToken)
    // await authModel.deleteRefreshToken(req.body.refreshToken)
    const access_token = req.headers['authorization']?.replace('Bearer ', '')
    await authModel.deleteAccessToken(access_token)
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
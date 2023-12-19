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
    const checkEmail = await userModel.getEmail(req.body.name)
    if (checkEmail) throw new ApiError(StatusCodes.BAD_REQUEST, 'Email đã được sử dụng. Hãy thử email khác')
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
    const token = jwtHelper.generateToken(user, env.ACCESS_TOKEN_SECRET, '0.5h')
    const refreshToken = jwtHelper.generateToken(user, env.REFRESH_TOKEN_SECRET, '365d')
    await authModel.addRefreshToken({ userId: user._id.toString(), refreshToken })
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
    const checkEmail = await userModel.getEmail(req.body.email)
    // if (checkEmail) throw new ApiError(StatusCodes.BAD_GATEWAY, 'Email đã được sử dụng. Vui lòng đăng nhập với mật khẩu hoặc sử dụng email khác')
    if (checkEmail) {
      const token = jwtHelper.generateToken(checkEmail, env.ACCESS_TOKEN_SECRET, '0.5h')
      const refreshToken = jwtHelper.generateToken(checkEmail, env.REFRESH_TOKEN_SECRET, '365d')
      await authModel.addRefreshToken({ userId: checkEmail._id.toString(), refreshToken })
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        path: '/',
        expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        sameSite: 'Lax'
      })
      return {
        token,
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
      // Tạo token
      const token = jwtHelper.generateToken(user, env.ACCESS_TOKEN_SECRET, '0.5h')
      const refreshToken = jwtHelper.generateToken(user, env.REFRESH_TOKEN_SECRET, '365d')
      await authModel.addRefreshToken({ userId: user._id.toString(), refreshToken })
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
    }
  } catch (error) {
    throw error
  }
}

const login = async (req, res) => {
  try {
    const user = await userModel.getEmail(req.body.email)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Nhập sai email người dùng')
    }
    const validations = await validationsPassword({
      id: user._id,
      password: req.body.password
    })

    if (!validations) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Nhập sai mật khẩu')
    }
    user.password = undefined
    if (user && validations) {
      const token = jwtHelper.generateToken(user, env.ACCESS_TOKEN_SECRET, '0.5h')
      const refreshToken = jwtHelper.generateToken(user, env.REFRESH_TOKEN_SECRET, '365d')
      await authModel.addRefreshToken({ userId: user._id.toString(), refreshToken })
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
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Không tìm thấy Refresh Token')
    }
    const checkToken = await authModel.getRefreshToken(refreshToken)
    if (!checkToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Refresh Token không hợp lệ')
    }
    await authModel.deleteRefreshToken(refreshToken)

    const tokenDecoded = jwtHelper.verifyToken(refreshToken, env.REFRESH_TOKEN_SECRET)
    if (!tokenDecoded) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Bạn không được phép truy cập')
    }
    const newAccessToken = jwtHelper.generateToken(tokenDecoded, env.ACCESS_TOKEN_SECRET, '0.5h')
    const newRefreshToken = jwtHelper.generateToken(tokenDecoded, env.REFRESH_TOKEN_SECRET, '365d')
    await authModel.addRefreshToken({ userId: tokenDecoded._id, refreshToken: newRefreshToken })
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
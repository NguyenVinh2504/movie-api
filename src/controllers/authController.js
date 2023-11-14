/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'
import { authService } from '~/services/authService'

//register
// /user/signup
const signUp = async (req, res, next) => {
  try {

    //Điều hướng dữ liệu sang tầng Service, rồi Service trả dữ liệu về
    const user = await authService.signUp(req, res)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(
      //dữ liệu từ service
      user
    )
  } catch (error) {
    // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
    next(error)
  }
}

const loginGoogle = async (req, res, next) => {
  try {

    //Điều hướng dữ liệu sang tầng Service, rồi Service trả dữ liệu về
    const user = await authService.loginGoogle(req, res)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(
      //dữ liệu từ service
      user
    )
  } catch (error) {
    // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
    next(error)
  }
}

//login user
// /user/login
const login = async (req, res, next) => {
  try {
    const user = await authService.login(req, res)
    res.status(StatusCodes.CREATED).json(
      user
    )
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const newRefreshToken = await authService.refreshToken(req, res)
    res.status(StatusCodes.CREATED).json(
      {
        accessToken: newRefreshToken
      }
    )
  } catch (error) {
    next(error)
  }
}
const logout = async (req, res, next) => {
  try {
    await authService.logout(req, res)
    res.status(StatusCodes.CREATED).json(
      'Logged out'
    )
  } catch (error) {
    next(error)
  }
}
export const authController = {
  signUp,
  loginGoogle,
  login,
  refreshToken,
  logout
}
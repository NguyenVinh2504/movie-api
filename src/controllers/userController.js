/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

//register
// /user/signup
const signUp = async (req, res, next) => {
  try {

    //Điều hướng dữ liệu sang tầng Service, rồi Service trả dữ liệu về
    const user = await userService.signUp(req.body)

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
    const user = await userService.login(req.body)
    res.status(StatusCodes.CREATED).json(
      user
    )
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req)
    res.status(StatusCodes.CREATED).json(
      user
    )
  } catch (error) {
    next(error)
  }
}

// /user/info
const getInfo = async (req, res, next) => {
  try {
    const signInUser = await userService.getInfo(req.user.id)

    res.status(StatusCodes.CREATED).json(
      signInUser
    )
  } catch (error) {
    next()
  }
}

export const userController = {
  signUp,
  login,
  deleteUser,
  getInfo
}
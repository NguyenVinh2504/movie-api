/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
const signIn = async (req, res, next) => {
  try {

    //Điều hướng dữ liệu sang tầng Service, rồi Service trả dữ liệu về
    const signInUser = await userService.signIn(req.body)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(
      //dữ liệu từ service
      signInUser
    )
  } catch (error) {
    // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
    next(error)
  }
}

const getInfo = async (req, res, next) => {
  try {
    const signInUser = await userService.getInfo(req.params.id)

    res.status(StatusCodes.CREATED).json(
      signInUser
    )
  } catch (error) {
    next(error)
  }
}
export const userController = {
  signIn,
  getInfo
}
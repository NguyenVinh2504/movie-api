/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'

const signIn = async (req, res, next) => {
  try {
    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json({
      message: 'POST from Controller: Api create new user'
    })
  } catch (error) {
    // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
    next(error)
  }
}

export const userController = {
  signIn
}
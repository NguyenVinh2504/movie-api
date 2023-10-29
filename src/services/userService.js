/* eslint-disable no-useless-catch */
import { userModel } from '~/models/userModel'
import { slugify } from '~/utils/formatters'
import bcryct from 'bcrypt'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'
const signIn = async (reqBody) => {
  try {
    const salt = await bcryct.genSalt(10)
    const hashed = await bcryct.hash(reqBody.password, salt)
    const existingUser = await userModel.getUser(reqBody)
    if (existingUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Đã có người dùng này')
    }

    // Xử lý logic dữ liệu
    const newUser = {
      ...reqBody,
      password: hashed,
      slug: slugify(reqBody.name)
    }
    //lấy dữ liệu từ model trả kết quả về cho controller, luôn phải có return
    return await userModel.signIn(newUser)
  } catch (error) {
    throw error
  }
}

const login = async (data) => {
  try {
    const user = await userModel.getUser(data)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Nhập sai người dùng')
    }
    const validations = await bcryct.compare(
      data.password,
      user.password
    )
    if (!validations) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Nhập sai mật khẩu')
    }
    user.password = undefined

    const token = jwt.sign({ data: user._id }, env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' })
    if (user && validations) {
      return {
        token,
        ...user,
        id: user._id
      }
    }


  } catch (error) {
    throw error
  }
}

const getInfo = async (id) => {
  try {
    const user = await userModel.getInfo(id)
    user.password = undefined
    user._id = undefined
    return {
      ...user,
      id: id
    }
  } catch (error) {
    throw error
  }
}

export const userService = {
  signIn,
  login,
  getInfo
}
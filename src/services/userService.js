/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
import { userModel } from '~/models/userModel'
import { slugify } from '~/utils/formatters'
import bcryct from 'bcrypt'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'
const signUp = async (reqBody) => {
  try {
    const salt = await bcryct.genSalt(10)
    const hashed = await bcryct.hash(reqBody.password, salt)
    const existingUser = await userModel.getUserName(reqBody)
    // Xử lý logic dữ liệu
    if (existingUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Đã có người dùng này')
    }
    const { confirmPassword, ...option } = reqBody
    const newUser = {
      ...option,
      password: hashed,
      slug: slugify(reqBody.name),
      userName: slugify(reqBody.name).replace('-', '')
    }
    const user = await userModel.signUp(newUser)
    const token = jwt.sign({ id: user._id, admin: user.admin }, env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' })
    return {
      token,
      ...user
    }
  } catch (error) {
    throw error
  }
}

const login = async (data) => {
  try {
    const user = await userModel.getUserName(data)
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

    if (user && validations) {
      const token = jwt.sign({ id: user._id, admin: user.admin }, env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' })
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

const deleteUser = async (req) => {
  try {
    // token mang id nào thì tìm user mang id của token tương ứng đó
    if (!req.user.admin) {
      return await userModel.deleteUser(req.user.id)
    }
    if (req.user.admin) {
      return await userModel.deleteUser(req.body.idUser)
    }

  } catch (error) {
    throw error
  }
}

const getInfo = async (id) => {
  try {
    // token mang id nào thì tìm user mang id của token tương ứng đó
    const user = await userModel.getInfo(id)
    return {
      ...user,
      id
    }
  } catch (error) {
    throw error
  }
}

export const userService = {
  signUp,
  login,
  deleteUser,
  getInfo
}
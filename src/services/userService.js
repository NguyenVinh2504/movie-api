/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
import { userModel } from '~/models/userModel'
import { slugify } from '~/utils/formatters'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'
import hashPassword from '~/utils/hashPassword'
import validationsPassword from '~/utils/validationsPassword'
import { jwtHelper } from '~/helpers/jwt.helper'

const deleteUser = async (req) => {
  try {
    const user = await userModel.getIdUser(req.user._id)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không có người dùng này')
    }
    const validations = await validationsPassword({ id : user._id, password: req.body.password })

    if (!validations) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Nhap sai mat khau')
    }

    // token mang id nào thì tìm user mang id của token tương ứng đó
    if (!req.user.admin) {
      return await userModel.deleteUser(req.user.id)
    }
    if (req.user.admin) {
      return await userModel.deleteUser(req.body.userId)
    }

  } catch (error) {
    throw error
  }
}

const updatePassword = async (req) => {
  try {
    const user = await userModel.getIdUser(req.user._id)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không có người dùng này')
    }
    const validations = await validationsPassword({ id : user._id, password: req.body.password })

    if (!validations) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Nhap sai mat khau')
    }

    const hashed = await hashPassword(req.body.newPassword)
    // token mang id nào thì tìm user mang id của token tương ứng đó
    await userModel.updateProfile({ id: user._id, body: { password: hashed } })
    return 'Đã cập nhật mật khẩu'
  } catch (error) {
    throw error
  }
}

const updateProfile = async (req) => {
  try {
    const user = await userModel.getIdUser(req.user._id)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không có người dùng này')
    }

    // token mang id nào thì tìm user mang id của token tương ứng đó
    const newUser = await userModel.updateProfile({ id: user._id, body: req.body })
    return newUser
  } catch (error) {
    throw error
  }
}

const getInfo = async (id) => {
  try {
    // token mang id nào thì tìm user mang id của token tương ứng đó
    const user = await userModel.getInfo(id)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không có người dùng này')
    }
    return {
      ...user,
      id
    }
  } catch (error) {
    throw error
  }
}

export const userService = {
  deleteUser,
  updatePassword,
  updateProfile,
  getInfo
}
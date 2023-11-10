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

const signUp = async (reqBody) => {
  try {
    // Mã hóa mật khẩu từ phía người dùng nhập vào
    const hashed = await hashPassword(reqBody.password)
    // Lấy ra tất cả dữ liệu từ người dùng trừ confirmPassword
    const { confirmPassword, ...option } = reqBody

    // Xử lí dữ liệu của người dùng và thêm vào một số thông tin khác
    const newUser = {
      ...option,
      password: hashed,
      slug: slugify(reqBody.name),
      userName: slugify(reqBody.name).replace('-', '')
    }

    // Truyền dữ liệu đã xử lí vào model
    const user = await userModel.signUp(newUser)

    // Tạo tooken
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
    const user = await userModel.getUserName(data.name)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Nhập sai người dùng')
    }
    const validations = await validationsPassword({
      id: user._id,
      password: data.password
    })

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
    const user = await userModel.getIdUser(req.user.id)
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
    const user = await userModel.getIdUser(req.user.id)
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
    const user = await userModel.getIdUser(req.user.id)
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
  signUp,
  login,
  deleteUser,
  updatePassword,
  updateProfile,
  getInfo
}
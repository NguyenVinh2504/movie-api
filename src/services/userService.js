/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
import { userModel } from '~/models/userModel'

import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

import hashPassword from '~/utils/hashPassword'
import validationsPassword from '~/utils/validationsPassword'

import { storage } from '~/config/firebase'
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage'

import { v4 } from 'uuid'

const deleteUser = async (req) => {
  try {
    const user = await userModel.getIdUser(req.user._id)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không có người dùng này')
    }
    const validations = await validationsPassword({ id: user._id, password: req.body.password })

    if (!validations) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Nhập sai mật khẩu')
    }
    // token mang id nào thì tìm user mang id của token tương ứng đó
    if (!req.user.admin) {
      return await userModel.deleteUser(req.user._id)
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
    const validations = await validationsPassword({ id: user._id, password: req.body.password })

    if (!validations) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Nhập sai mật khẩu')
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
    if (req.body.avatar) {
      const imageDel = ref(storage, req.body.avatar)
      const err = await deleteObject(imageDel)
      req.body.avatar = null
      req.body.temporaryAvatar = null
    }
    if (req.file) {
      const imageRef = ref(storage, `images/${v4()}`)
      const medadate = {
        contentType: req.file.mimetype
      }
      const res = await uploadBytes(imageRef, req.file.buffer, medadate)
      if (res) {
        const url = await getDownloadURL(res.ref)
        req.body.avatar = url
      }
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
      id,
      ...user
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
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

import nodemailer from 'nodemailer'
import { env } from '~/config/environment'

import otpGenerator from 'otp-generator'
import { otpService } from './otpService'
import { otpModel } from '~/models/otpModel'

const deleteUser = async (req) => {
  try {
    const user = await userModel.getIdUser(req.user._id)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không có người dùng này')
    }
    const validations = await validationsPassword({ id: user._id, password: req.body.password })

    if (!validations) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, undefined, {
        name: 'PASSWORD',
        message: 'Mật khẩu không chính xác'
      })
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
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, undefined, {
        name: 'PASSWORD',
        message: 'Mật khẩu không chính xác'
      })
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
      // const err = await deleteObject(imageDel)
      deleteObject(imageDel)
        .then((data) => {})
        .catch((error) => {})
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
const checkEmail = async (req) => {
  try {
    const { email } = req.body
    const user = await userModel.getEmail(email)
    if (!user) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, undefined, {
        name: 'EMAIL',
        message: 'Không có email này'
      })
    }
    return {
      message: 'Valid Email'
    }
  } catch (error) {
    throw error
  }
}

const sendEmail = async (req) => {
  try {
    const { email } = req.body
    const otpHolder = await otpModel.findOtp(email)
    if (otpHolder) {
      await otpModel.deleteOtp(email)
    }
    const OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    })

    await otpService.otpCreate({ email, otp: OTP })
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // `true` for port 465, `false` for all other ports
      auth: {
        user: env.EMAIL_NAME,
        pass: env.EMAIL_PASS
      }
    })

    // send mail with defined transport object
    await transporter.sendMail({
      from: 'Viejoy <viejoy2023@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'Khôi phục mật khẩu', // Subject line
      text: `OTP: ${OTP}` // plain text body
    })
  } catch (error) {
    throw error
  }
}

const forgotPassword = async (req) => {
  try {
    const { email, otp, newPassword } = req.body
    otp.toString()
    const otpHolder = await otpModel.findOtp(email)
    if (!otpHolder.length) throw new ApiError(StatusCodes.NOT_FOUND, 'Expired Otp')
    const lastOtp = otpHolder[otpHolder.length - 1]
    const isValid = await otpService.otpVerify({ otp, hashOtp: lastOtp.otp })
    if (!isValid) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid Otp')

    const user = await userModel.getEmail(email)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không có người dùng này')
    }

    if (isValid && user) {
      const hashed = await hashPassword(newPassword)
      await userModel.updateProfile({ id: user._id, body: { password: hashed } })
      await otpModel.deleteOtp(email)
      return {
        message: 'thay doi mat khau thanh cong'
      }
    }
  } catch (error) {
    throw error
  }
}

export const userService = {
  deleteUser,
  updatePassword,
  updateProfile,
  getInfo,
  checkEmail,
  sendEmail,
  forgotPassword
}

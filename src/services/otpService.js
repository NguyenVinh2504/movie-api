/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
import { otpModel } from '~/models/otpModel'

import hashPassword from '~/utils/hashPassword'

import bcryct from 'bcrypt'

const otpCreate = async (data) => {
  try {
    const { email, otp } = data
    const hastOtp = await hashPassword(otp)
    // token mang id nào thì tìm user mang id của token tương ứng đó
    const getOtp = await otpModel.createOtp({ email, otp: hastOtp })
    return getOtp ? 1 : 0
  } catch (error) {
    throw error
  }
}

const otpVerify = async ({ otp, hashOtp }) => {
  try {
    const isValid = await bcryct.compare(
      otp,
      hashOtp
    )
    return isValid
  } catch (error) {
    throw error
  }
}

export const otpService = {
  otpCreate,
  otpVerify
}
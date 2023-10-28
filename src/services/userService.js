/* eslint-disable no-useless-catch */
import { userModel } from '~/models/userModel'
import { slugify } from '~/utils/formatters'

const signIn = async (reqBody) => {
  try {
    // Xử lý logic dữ liệu
    const newUser = {
      ...reqBody,
      slug: slugify(reqBody.name)
    }
    //lấy dữ liệu từ model trả kết quả về cho controller, luôn phải có return
    return await userModel.signIn(newUser)
  } catch (error) {
    throw error
  }
}

const getInfo = async (id) => {
  try {
    return await userModel.getInfo(id)
  } catch (error) {
    throw error
  }
}

export const userService = {
  signIn,
  getInfo
}
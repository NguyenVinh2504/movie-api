/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { authModel } from '~/models/authModel'
import ApiError from '~/utils/ApiError'

// Tìm privateKey và publicKey thông qua id user trong token được user gửi lên
const findKeyTokenById = async (token) => {
    try {
        // Lấy id user trong token để tìm privateKey và publicKey tương ứng trong db
        const payLoadToken = jwt.decode(token)
        const keyStore = await authModel.getKeyToken(payLoadToken?._id)
        if (!keyStore) throw new ApiError(StatusCodes.UNAUTHORIZED, { name: 'NOT_FOUND', message: 'Không tìm thấy keyStore' })
        return keyStore
    } catch (error) {
        throw Error(error)
    }
    // Tìm privateKey và publicKey trong db với id user vừa lấy được trong token
}

export default findKeyTokenById
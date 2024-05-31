/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { authModel } from '~/models/authModel'
import ApiError from '~/utils/ApiError'


const findKeyTokenById = async (token) => {
    const payLoadToken = jwt.decode(token)
    const keyStore = await authModel.getKeyToken(payLoadToken._id)
    if (!keyStore) throw new ApiError(StatusCodes.UNAUTHORIZED, { name: 'NOT_FOUND', message: 'Không tìm thấy keyStore' })

    return keyStore
}

export default findKeyTokenById
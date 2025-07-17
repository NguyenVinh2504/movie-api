import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const isAdmin = (req, res, next) => {
  if (req.user && req.user.admin === true) {
    next()
  } else {
    next(new ApiError(StatusCodes.FORBIDDEN, 'Yêu cầu quyền admin'))
  }
}

export { isAdmin }

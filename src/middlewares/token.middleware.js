import { StatusCodes } from 'http-status-codes'
import jsonwebtoken from 'jsonwebtoken'
import { env } from '~/config/environment'
import { userService } from '~/services/userService'
import ApiError from '~/utils/ApiError'


const tokenDecode = (req) => {
  try {
    const bearerHeader = req.headers['authorization']
    if (bearerHeader) {
      const token = bearerHeader.split(' ')[1]

      return jsonwebtoken.verify(
        token,
        env.ACCESS_TOKEN_SECRET
      )
    }
    return false
  } catch {
    return false
  }
}

const auth = async (req, res, next) => {
  try { const tokenDecoded = tokenDecode(req)
    if (!tokenDecoded) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Bạn không được phép truy cập')
    }

    const user = await userService.getInfo(tokenDecoded.data)

    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Không tìm thấy user')
    }
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}

export default { auth, tokenDecode }
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
import { userModel } from '~/models/userModel'
import { formatUserName, slugify } from '~/utils/formatters'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import hashPassword from '~/utils/hashPassword'
import validationsPassword from '~/utils/validationsPassword'
import { jwtHelper } from '~/helpers/jwt.helper'
import { authModel } from '~/models/authModel'
import tokenMiddleware from '~/middlewares/token.middleware'
import generateKey from '~/utils/generateKey'
import axios from 'axios'
import { timeExpired } from '~/utils/constants'

const signUp = async (req, res) => {
  try {
    const checkEmail = await userModel.getEmail(req.body.email)
    if (checkEmail) throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, {
      name: 'EMAIL',
      message: 'Email đã được đăng ký'
    })
    // Mã hóa mật khẩu từ phía người dùng nhập vào
    const hashed = await hashPassword(req.body.password)
    // Lấy ra tất cả dữ liệu từ người dùng trừ confirmPassword
    const { confirmPassword, ...option } = req.body

    // Xử lí dữ liệu của người dùng và thêm vào một số thông tin khác
    const newUser = {
      ...option,
      password: hashed,
      slug: slugify(req.body.name),
      userName: `@${formatUserName(req.body.name)}`,
      temporaryAvatar: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${formatUserName(req.body.name)}`
    }

    // Truyền dữ liệu đã xử lí vào model
    const user = await authModel.signUp(newUser)
    if (user) {
      // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem'
      //   },
      //   privateKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem'
      //   }
      // })

      // Tạo privateKey và publicKey mới cho user
      const { publicKey, privateKey } = generateKey()
      // Thêm vào db để lưu privateKey và publicKey
      const keyStore = await authModel.createKeyToken({ userId: user._id.toString(), privateKey, publicKey })

      // Tạo accessToken và refreshToken bằng privateKey và publicKey
      const accessToken = jwtHelper.generateToken({ user, tokenSecret: keyStore.publicKey, tokenLife: timeExpired })
      const refreshToken = jwtHelper.generateToken({ user, tokenSecret: keyStore.privateKey, tokenLife: '365d' })

      await Promise.all([
        // Thêm accessToken và refreshToke vào db
        await authModel.addRefreshToken({ userId: user._id.toString(), refreshToken }),
        await authModel.addAccessToken({ userId: user._id.toString(), accessToken })
      ])
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        path: '/',
        // maxAge: 31557600000,
        expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        sameSite: 'Lax'
      })
      user.password = undefined
      return {
        accessToken,
        refreshToken,
        ...user
      }
    }
    // Tạo token
  } catch (error) {
    throw error
  }
}

// const loginGoogle = async (req, res) => {
//   try {
//     const checkEmail = await userModel.getEmail(req.body.email)
//     // if (checkEmail) throw new ApiError(StatusCodes.BAD_GATEWAY, 'Email đã được sử dụng. Vui lòng đăng nhập với mật khẩu hoặc sử dụng email khác')
//     if (checkEmail) {
//       const accessToken = jwtHelper.generateToken({ user: checkEmail, tokenSecret: env.ACCESS_TOKEN_SECRET, tokenLife: timeExpired })
//       const refreshToken = jwtHelper.generateToken({ user: checkEmail, tokenSecret: env.REFRESH_TOKEN_SECRET, tokenLife: '365d' })
//       await authModel.addRefreshToken({ userId: checkEmail._id.toString(), refreshToken })
//       await authModel.addAccessToken({ userId: checkEmail._id.toString(), accessToken })
//       res.cookie('refreshToken', refreshToken, {
//         httpOnly: true,
//         secure: true,
//         path: '/',
//         expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
//         sameSite: 'Lax'
//       })
//       return {
//         accessToken,
//         refreshToken,
//         ...checkEmail
//       }
//     } else {
//       // Mã hóa mật khẩu từ phía người dùng nhập vào
//       const hashed = await hashPassword(req.body.password)
//       // Lấy ra tất cả dữ liệu từ người dùng trừ confirmPassword
//       const { name, confirmPassword, avatar, ...option } = req.body
//       // Xử lí dữ liệu của người dùng và thêm vào một số thông tin khác
//       const newUser = {
//         name,
//         temporaryAvatar: avatar,
//         ...option,
//         password: hashed,
//         slug: slugify(name),
//         userName: `@${formatUserName(name)}`
//       }

//       // Truyền dữ liệu đã xử lí vào model
//       const user = await authModel.signUp(newUser)
//       // Tạo accessToken
//       const accessToken = jwtHelper.generateToken({ user, tokenSecret: env.ACCESS_TOKEN_SECRET, tokenLife: timeExpired })
//       const refreshToken = jwtHelper.generateToken({ user, tokenSecret: env.REFRESH_TOKEN_SECRET, tokenLife: '365d' })
//       await authModel.addRefreshToken({ userId: user._id.toString(), refreshToken })
//       await authModel.addAccessToken({ userId: checkEmail._id.toString(), accessToken })
//       res.cookie('refreshToken', refreshToken, {
//         httpOnly: true,
//         secure: true,
//         path: '/',
//         // maxAge: 31557600000,
//         expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
//         sameSite: 'Lax'
//       })
//       user.password = undefined
//       return {
//         accessToken,
//         refreshToken,
//         ...user
//       }
//     }
//   } catch (error) {
//     throw error
//   }
// }


const getOauthGoogleToken = async (code) => {
  const body = {
    code,
    client_id: env.CLIENT_ID_GOOGLE,
    redirect_uri: env.REDIRECT_URI,
    client_secret: env.CLIENT_SECRET,
    grant_type: 'authorization_code'
  }

  const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

  return data
}


const getGoogleUserInfo = async (access_token, id_token) => {
  const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${id_token}`
    },
    params: {
      access_token,
      alt: 'json'
    }
  })

  return data
}

const loginGoogle = async (code, res) => {
  const { id_token, access_token } = await getOauthGoogleToken(code)
  const userInfo = await getGoogleUserInfo(access_token, id_token)
  if (!userInfo.email_verified) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email not verified')
  }
  const checkEmail = await userModel.getEmail(userInfo.email)
  if (checkEmail) {
    // Kiểm tra xem keyStore có tồn tại không
    let keyStore = await authModel.getKeyToken(checkEmail._id.toString())
    // Không thì tạo tài liệu keyStore
    if (!keyStore) {
      const { publicKey, privateKey } = generateKey()
      await authModel.createKeyToken({ userId: checkEmail._id.toString(), privateKey, publicKey })
    }
    // Get privateKey và publicKey trong db để tạo token
    keyStore = await authModel.getKeyToken(checkEmail._id.toString())
    const accessToken = jwtHelper.generateToken({ user: checkEmail, tokenSecret: keyStore.publicKey, tokenLife: timeExpired })
    const refreshToken = jwtHelper.generateToken({ user: checkEmail, tokenSecret: keyStore.privateKey, tokenLife: '365d' })

    await Promise.all([
      authModel.addRefreshToken({ userId: checkEmail._id.toString(), refreshToken }),
      authModel.addAccessToken({ userId: checkEmail._id.toString(), accessToken })
    ])

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      path: '/',
      // maxAge: 31557600000,
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      sameSite: 'Lax'
    })
    return {
      ...checkEmail,
      password: undefined,
      accessToken,
      refreshToken
    }
  }
  const { name, picture, email, sub } = userInfo
  // Mã hóa mật khẩu từ phía người dùng nhập vào
  const hashed = await hashPassword(sub)
  // Lấy ra tất cả dữ liệu từ người dùng trừ confirmPassword

  // Xử lí dữ liệu của người dùng và thêm vào một số thông tin khác
  const newUser = {
    password: hashed,
    slug: slugify(name),
    userName: `@${formatUserName(name)}`,
    temporaryAvatar: picture,
    email,
    name
  }
  // Truyền dữ liệu đã xử lí vào model
  const user = await authModel.signUp(newUser)
  if (user) {
    // Tạo privateKey và publicKey mới cho user
    const { publicKey, privateKey } = generateKey()
    // Thêm vào db để lưu privateKey và publicKey
    const keyStore = await authModel.createKeyToken({ userId: user._id.toString(), privateKey, publicKey })

    // Tạo accessToken và refreshToken bằng privateKey và publicKey
    const accessToken = jwtHelper.generateToken({ user, tokenSecret: keyStore.publicKey, tokenLife: timeExpired })
    const refreshToken = jwtHelper.generateToken({ user, tokenSecret: keyStore.privateKey, tokenLife: '365d' })

    await Promise.all([
      // Thêm accessToken và refreshToke vào db
      authModel.addRefreshToken({ userId: user._id.toString(), refreshToken }),
      authModel.addAccessToken({ userId: user._id.toString(), accessToken })
    ])
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      path: '/',
      // maxAge: 31557600000,
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      sameSite: 'Lax'
    })
    user.password = undefined
    return {
      accessToken,
      refreshToken,
      ...user
    }
  }
}

const login = async (req, res) => {
  try {
    // Kiểm tra user đã được đăng ký chưa
    const user = await userModel.getEmail(req.body.email)
    if (!user) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, {
        name: 'EMAIL',
        message: 'Không tìm thấy email'
      })
    }

    // Kiểm tra mật khẩu user gửi lên có khớp với mật khẩu đã đăng ký không
    const validations = await validationsPassword({
      id: user._id,
      password: req.body.password
    })

    if (!validations) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, {
        name: 'PASSWORD',
        message: 'Mật khẩu không chính xác'
      })
    }
    user.password = undefined

    if (user && validations) {
      // Kiểm tra xem keyStore có tồn tại không
      let keyStore = await authModel.getKeyToken(user._id.toString())
      // Không thì tạo tài liệu keyStore
      if (!keyStore) {
        const { publicKey, privateKey } = generateKey()
        await authModel.createKeyToken({ userId: user._id.toString(), privateKey, publicKey })
      }
      // Get privateKey và publicKey trong db để tạo token
      keyStore = await authModel.getKeyToken(user._id.toString())
      const accessToken = jwtHelper.generateToken({ user, tokenSecret: keyStore.publicKey, tokenLife: timeExpired })
      const refreshToken = jwtHelper.generateToken({ user: user, tokenSecret: keyStore.privateKey, tokenLife: '365d' })

      await Promise.all([
        authModel.addRefreshToken({ userId: user._id.toString(), refreshToken }),
        authModel.addAccessToken({ userId: user._id.toString(), accessToken })
      ])
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        path: '/',
        // maxAge: 31557600000,
        expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        sameSite: 'Lax'
      })
      return {
        ...user,
        accessToken,
        refreshToken
      }
    }
  } catch (error) {
    throw error
  }
}

const refreshToken = async (req, res) => {
  try {
    // const refreshToken = req.cookies.refreshToken
    const decoded = req.decoded
    const keyStore = req.keyStore
    const refreshToken = req.refreshToken
    const access_token = req.headers['authorization']?.replace('Bearer ', '')

    // refreshToken gửi lên đã được sử dụng để refreshToken chưa
    if ('refreshTokensUsed' in keyStore && Array.isArray(keyStore.refreshTokensUsed) && keyStore.refreshTokensUsed.includes(refreshToken)) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Có gì đó không ổn. Đăng nhập lại!')
    }

    // Kiểm tra refreshToken trong db có không
    const checkToken = await authModel.getRefreshToken(refreshToken)
    if (!checkToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Không tìm thấy Refresh Token')
    }

    // Kiểm tra user có trong db không
    const user = await userModel.getInfo(decoded._id)
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Không tìm thấy user')
    }

    await Promise.all([
      // Xóa refreshToken và accessToken cũ
      authModel.deleteRefreshToken(refreshToken),
      authModel.deleteAccessToken(access_token)
    ])
    // // Xóa refreshToken và accessToken cũ
    // await authModel.deleteRefreshToken(refreshToken)
    // await authModel.deleteAccessToken(access_token)


    // Tạo accessToken và refreshToken bằng privateKey và publicKey của user trong db
    const newAccessToken = jwtHelper.generateToken({ user: decoded, tokenSecret: keyStore.publicKey, tokenLife: timeExpired })
    const newRefreshToken = jwtHelper.generateToken({ user: decoded, tokenSecret: keyStore.privateKey, exp: decoded.exp })
    await Promise.all([
      authModel.addRefreshToken({ userId: decoded._id, refreshToken: newRefreshToken }),
      authModel.addAccessToken({ userId: decoded._id, accessToken: newAccessToken }),
      authModel.updateKeyToken({ userId: decoded._id, refreshToken })
    ])

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      path: '/',
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      sameSite: 'Lax'
    })
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  } catch (error) {
    throw error
  }
}
const logout = async (req, res) => {
  try {
    // Xóa refreshToken ở cookie
    res.clearCookie('refreshToken')
    // await authModel.deleteRefreshToken(req.body.refreshToken)
    const access_token = req.headers['authorization']?.replace('Bearer ', '')

    await Promise.all([
      // Xóa refreshToken ở db
      authModel.deleteRefreshToken(req.cookies.refreshToken),
      // Xóa accessToken ở db
      authModel.deleteAccessToken(access_token)
    ])
  }
  catch (error) {
    throw error
  }
}
export const authService = {
  signUp,
  loginGoogle,
  login,
  refreshToken,
  logout
}
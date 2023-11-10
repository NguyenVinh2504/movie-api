/* eslint-disable no-console */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { joiPasswordExtendCore } from 'joi-password'
import { userModel } from '~/models/userModel'

const joiPassword = Joi.extend(joiPasswordExtendCore)

const signUp = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().min(8).required().label('name')
      .external(async (value, help) => {
        const user = await userModel.getUserName(value )
        if (user) return help.message('Đã có người dùng này')
      })
      .messages({
        'string.min': '{#label} Tối thiếu 8 kí tự',
        'any.required': '{#label} Chưa nhập tên đăng nhập'
      }),
    email: Joi.string().email().required('This is required')
      .label('email')
      .messages({
        'string.email': '{#label} Sai định dạng email',
        'any.required': '{#label} Email chưa nhập'
      }),
    password: joiPassword.string()
      .min(8)
      .minOfSpecialCharacters(1)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .onlyLatinCharacters()
      .required()
      .label('Mật khẩu')
      .messages({
        'any.required': 'Chưa nhập {#label}',
        'string.min': '{#label} chứa ít nhất 8 kí tự',
        'password.minOfUppercase': '{#label} nên chứa chữ viết hoa',
        'password.minOfSpecialCharacters':
              '{#label} nên chứa kí tự đặc biệt',
        'password.minOfLowercase': '{#label} nên chứa chữ viết thường',
        'password.minOfNumeric': '{#label} nên chứa chữ số',
        'password.noWhiteSpaces': '{#label} không nên có khoảng trắng',
        'password.onlyLatinCharacters': '{#label} chỉ nên chứa các kí tự Latin'
      }),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required()
      .label('Confirm password')
      .messages({ 'any.only': '{{#label}} nhập lại mật khẩu chưa chính xác',
        'any.required': '{{#label}} Chưa nhập lại mật khẩu' })
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Kiểm tra dữ liệu xong xuôi cho giá trị client đi tiếp controller
    next()
  } catch (error) {
    // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const login = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required().label('name')
      .messages({
        'any.required': '{#label} Chưa nhập tên đăng nhập'
      }),
    password: joiPassword.string()
      .required()
      .label('Mật khẩu')
      .messages({
        'any.required': 'Chưa nhập {#label}'
      })
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Kiểm tra dữ liệu xong xuôi cho giá trị client đi tiếp controller
    next()
  } catch (error) {
    // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const deleteUser = async (req, res, next) => {
  const correctCondition = Joi.object({
    password: joiPassword.string()
      .required()
      .label('Mật khẩu')
      .messages({
        'any.required': 'Chưa nhập {#label}'
      }),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required()
      .label('Confirm password')
      .messages({ 'any.only': '{{#label}} nhập lại mật khẩu chưa chính xác',
        'any.required': '{{#label}} Chưa nhập lại mật khẩu' }),
    userId: Joi.string()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Kiểm tra dữ liệu xong xuôi cho giá trị client đi tiếp controller
    next()
  } catch (error) {
    // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updatePassword = async (req, res, next) => {
  const correctCondition = Joi.object({
    password: joiPassword.string()
      .required()
      .label('Mật khẩu')
      .messages({
        'any.required': 'Chưa nhập {#label}'
      }),
    newPassword: joiPassword.string()
      .min(8)
      .minOfSpecialCharacters(1)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .onlyLatinCharacters()
      .required()
      .label('Mật khẩu mới')
      .messages({
        'any.required': 'Chưa nhập {#label}',
        'string.min': '{#label} chứa ít nhất 8 kí tự',
        'password.minOfUppercase': '{#label} nên chứa chữ viết hoa',
        'password.minOfSpecialCharacters':
              '{#label} nên chứa kí tự đặc biệt',
        'password.minOfLowercase': '{#label} nên chứa chữ viết thường',
        'password.minOfNumeric': '{#label} nên chứa chữ số',
        'password.noWhiteSpaces': '{#label} không nên có khoảng trắng',
        'password.onlyLatinCharacters': '{#label} chỉ nên chứa các kí tự Latin'
      }),
    confirmPassword: Joi.any().valid(Joi.ref('newPassword')).required()
      .label('Confirm password')
      .messages({ 'any.only': '{{#label}} nhập lại mật khẩu chưa chính xác',
        'any.required': '{{#label}} Chưa nhập lại mật khẩu' })
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Kiểm tra dữ liệu xong xuôi cho giá trị client đi tiếp controller
    next()
  } catch (error) {
    // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updateProfile = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().min(8).label('name')
      .external(async (value, help) => {
        const user = await userModel.getUserName(value )
        if (user) return help.message('Đã có người dùng này')
      })
      .messages({
        'string.min': '{#label} Tối thiếu 8 kí tự',
        'any.required': '{#label} Chưa nhập tên đăng nhập'
      }),
    email: Joi.string().email()
      .label('email')
      .messages({
        'string.email': '{#label} Sai định dạng email'
      }),
    phone: Joi.number().default(null),
    avatar: Joi.string().default(null)
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Kiểm tra dữ liệu xong xuôi cho giá trị client đi tiếp controller
    next()
  } catch (error) {
    // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const userValidation = {
  signUp,
  login,
  deleteUser,
  updatePassword,
  updateProfile
}
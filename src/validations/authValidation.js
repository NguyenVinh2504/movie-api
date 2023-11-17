/* eslint-disable no-console */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { joiPasswordExtendCore } from 'joi-password'

const joiPassword = Joi.extend(joiPasswordExtendCore)

const signUp = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().min(8).required().label('name')
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
    avatar: Joi.string().default(null),
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
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const login = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().label('email')
      .messages({
        'any.required': '{#label} Chưa nhập email đăng nhập'
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
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const authValidation = {
  signUp,
  login
}
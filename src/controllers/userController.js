/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const deleteUser = async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req)
    res.status(StatusCodes.CREATED).json(user)
  } catch (error) {
    next(error)
  }
}

const updatePassword = async (req, res, next) => {
  try {
    const user = await userService.updatePassword(req)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

// /user/info
const getInfo = async (req, res, next) => {
  try {
    const signInUser = await userService.getInfo(req.user._id)
    res.status(StatusCodes.CREATED).json(signInUser)
  } catch (error) {
    next(error)
  }
}
const checkEmail = async (req, res, next) => {
  try {
    const result = await userService.checkEmail(req)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}
const sendEmail = async (req, res, next) => {
  try {
    await userService.sendEmail(req)
    res.status(StatusCodes.CREATED).json('Send successfully')
  } catch (error) {
    next(error)
  }
}

const forgotPassword = async (req, res, next) => {
  try {
    const result = await userService.forgotPassword(req)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  deleteUser,
  updatePassword,
  updateProfile,
  getInfo,
  sendEmail,
  checkEmail,
  forgotPassword
}

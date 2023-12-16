/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */

import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { favoriteModel } from '~/models/favoriteModel'
import { userModel } from '~/models/userModel'

const addFavorite = async (req) => {
  try {
    const newFavorite = {
      userId: req.user._id,
      ...req.body
    }
    const addFavorite = await favoriteModel.addFavorite(newFavorite)
    const { userId } = addFavorite
    const user = await userModel.getInfo(userId)
    // if (addFavorite) {
    //   await userModel.pushFavorites(addFavorite)
    // }

    return {
      ...user
    }
  } catch (error) {
    throw error
  }
}

const removeFavorite = async (favoriteId) => {
  try {
    await favoriteModel.deleteOneById(favoriteId)
    return { removeFavorite: 'Đã xóa thành công' }
  } catch (error) {
    throw error
  }
}

export const favoriteService = {
  addFavorite,
  removeFavorite
}
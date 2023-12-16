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

    if (addFavorite) {
      await userModel.pushFavorites(addFavorite)
    }

    return {
      ...addFavorite
    }
  } catch (error) {
    throw error
  }
}

export const favoriteService = {
  addFavorite
}
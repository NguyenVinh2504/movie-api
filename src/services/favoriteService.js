/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */

import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { favoriteModel } from '~/models/favoriteModel'
import { userModel } from '~/models/userModel'

const addFavorite = async (req) => {
  try {
    const dataReq = {
      userId: req.user._id,
      ...req.body
    }
    const newFavorite = await favoriteModel.addFavorite(dataReq)

    // console.log(addFavorite);
    const { userId } = addFavorite
    const user = await userModel.getInfo(userId)
    // if (addFavorite) {
    //   await userModel.pushFavorites(addFavorite)
    // }

    return {
      favorites: [newFavorite]
    }
  } catch (error) {
    throw error
  }
}

const removeFavorite = async ({ req, favoriteId }) => {
  try {
    const idUser = req.user._id
    const retult = await favoriteModel.deleteOneById({ idUser, favoriteId })

    return retult
  } catch (error) {
    throw error
  }
}

const getFavorites = async ({ req }) => {
  try {
    const idUser = req.user._id
    const retult = await favoriteModel.findFavorite(idUser)

    return retult
  } catch (error) {
    throw error
  }
}

export const favoriteService = {
  addFavorite,
  removeFavorite,
  getFavorites
}

/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'
import { favoriteService } from '~/services/favoriteService'

const addFavorite = async (req, res, next) => {
  try {
    const dataFavorite = await favoriteService.addFavorite(req)
    res.status(StatusCodes.CREATED).json(
      dataFavorite
    )
  } catch (error) {
    next(error)
  }
}

const removeFavorite = async (req, res, next) => {
  try {
    const favoriteId = req.params.id
    const result = await favoriteService.removeFavorite({ req, favoriteId })
    res.status(StatusCodes.CREATED).json(
      {
        favorites: result
      }
    )
  } catch (error) {
    next(error)
  }
}

export const favoriteController = {
  addFavorite,
  removeFavorite
}
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

export const favoriteController = {
  addFavorite
}
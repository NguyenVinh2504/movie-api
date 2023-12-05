import { StatusCodes } from 'http-status-codes'
import { mediaService } from '~/services/media.services'

const getList = async (req, res, next) => {
  try {
    const mediaList = await mediaService.getList(req)
    res.status(StatusCodes.CREATED).json(
      mediaList
    )
  } catch (error) {
    next(error)
  }
}
const getTrending = async (req, res, next) => {
  try {
    const mediaList = await mediaService.getTrending(req)
    res.status(StatusCodes.CREATED).json(
      mediaList
    )
  } catch (error) {
    next(error)
  }
}
const getDiscoverGenres = async (req, res, next) => {
  try {
    const mediaList = await mediaService.getDiscoverGenres(req)
    res.status(StatusCodes.CREATED).json(
      mediaList
    )
  } catch (error) {
    next(error)
  }
}
const getGenres = async (req, res, next) => {
  try {
    const mediaGenres = await mediaService.getGenres(req)
    res.status(StatusCodes.CREATED).json(
      mediaGenres
    )
  } catch (error) {
    next(error)
  }
}
const getDetail = async (req, res, next) => {
  try {
    const mediaDetail = await mediaService.getDetail(req)
    res.status(StatusCodes.CREATED).json(
      mediaDetail
    )
  } catch (error) {
    next(error)
  }
}
const getDetailSeason = async (req, res, next) => {
  try {
    const mediaDetailSeason = await mediaService.getDetailSeason(req)
    res.status(StatusCodes.CREATED).json(
      mediaDetailSeason
    )
  } catch (error) {
    next(error)
  }
}
const search = async (req, res, next) => {
  try {
    const mediaSearch= await mediaService.search(req)
    res.status(StatusCodes.CREATED).json(
      mediaSearch
    )
  } catch (error) {
    next(error)
  }
}
export const mediaController = {
  getList,
  getTrending,
  getDiscoverGenres,
  getGenres,
  getDetail,
  getDetailSeason,
  search
}
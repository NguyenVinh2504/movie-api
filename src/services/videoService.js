import { tvVideoModel } from '~/models/tvVideoModel'

const { StatusCodes } = require('http-status-codes')
const { movieVideoModel } = require('~/models/movieVideoModel')
const { default: ApiError } = require('~/utils/ApiError')

const getMovieVideo = async ({ mediaId }) => {
  const movieVideo = await movieVideoModel.getMovieVideoInfo({ mediaId })
  if (!movieVideo) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Movie video not found')
  }
  return movieVideo
}

const getTvVideo = async ({ mediaId, episodeId, seasonNumber, episodeNumber }) => {
  const movieVideo = await tvVideoModel.getTvVideoInfo({ mediaId, episodeId, seasonNumber, episodeNumber })
  if (!movieVideo) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Tv video not found')
  }
  return movieVideo
}
export const videoService = {
  getMovieVideo,
  getTvVideo
}

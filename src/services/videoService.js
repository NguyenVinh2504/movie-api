import { episodeModel } from '~/models/episodeModel'
import { videoMediaModel } from '~/models/videoMeidaModel'

const { StatusCodes } = require('http-status-codes')
const { default: ApiError } = require('~/utils/ApiError')

const getMovieVideo = async ({ tmdbId }) => {
  const movieVideo = await videoMediaModel.getMovieByTmdbIdForUser({ tmdbId })
  if (!movieVideo) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Movie video not found')
  }
  return movieVideo
}

const getTvVideo = async ({ tmdbId, episodeId, seasonNumber, episodeNumber }) => {
  const episodeVideo = await episodeModel.getEpisodeForUser({ tmdbId, episodeId, seasonNumber, episodeNumber })
  return episodeVideo
}
export const videoService = {
  getMovieVideo,
  getTvVideo
}

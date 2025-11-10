import { episodeModel } from '~/models/episodeModel'
import { videoMediaModel } from '~/models/videoMeidaModel'

const { StatusCodes } = require('http-status-codes')
const { default: ApiError } = require('~/utils/ApiError')

const getMoviePlayback = async ({ tmdbId }) => {
  const movieVideo = await videoMediaModel.getMovieByTmdbIdForUser({ tmdbId })
  if (!movieVideo) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Movie not found')
  }
  return movieVideo
}

const getTvPlayback = async ({ tmdbId, episodeId, seasonNumber, episodeNumber }) => {
  const episodeVideo = await episodeModel.getEpisodeForUser({ tmdbId, episodeId, seasonNumber, episodeNumber })
  if (!episodeVideo) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Episode not found')
  }
  return episodeVideo
}

export const playbackService = {
  getMoviePlayback,
  getTvPlayback
}

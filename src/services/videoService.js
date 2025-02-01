const { StatusCodes } = require('http-status-codes')
const { movieVideoModel } = require('~/models/movieVideoModel')
const { default: ApiError } = require('~/utils/ApiError')

const getMovieVideo = async ({ mediaId }) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const movieVideo = await movieVideoModel.getMovieVideoInfo({ mediaId })
    if (!movieVideo) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Movie video not found')
    }
    return movieVideo
  } catch (error) {
    throw error
  }
}
export const videoService = {
  getMovieVideo
}

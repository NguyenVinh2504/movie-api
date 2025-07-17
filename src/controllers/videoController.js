const { StatusCodes } = require('http-status-codes')
const { videoService } = require('~/services/videoService')

const getMovieVideo = async (req, res, next) => {
  try {
    const { tmdbId } = req.params

    const mediaVideo = await videoService.getMovieVideo({
      tmdbId
    })
    res.status(StatusCodes.CREATED).json(mediaVideo)
  } catch (error) {
    next(error)
  }
}
const getTvVideo = async (req, res, next) => {
  try {
    Object.keys(req.params).forEach((key) => (req.params[key] = parseInt(req.params[key])))
    const { tmdbId, episodeId, seasonNumber, episodeNumber } = req.params

    const mediaVideo = await videoService.getTvVideo({ tmdbId, episodeId, seasonNumber, episodeNumber })
    res.status(StatusCodes.CREATED).json(mediaVideo)
  } catch (error) {
    next(error)
  }
}
export const videoController = {
  getMovieVideo,
  getTvVideo
}

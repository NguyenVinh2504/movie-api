const { StatusCodes } = require('http-status-codes')
const { videoService } = require('~/services/videoService')

const getMovieVideo = async (req, res, next) => {
  try {
    const { mediaId } = req.params

    const mediaVideo = await videoService.getMovieVideo({
      mediaId
    })
    res.status(StatusCodes.CREATED).json(mediaVideo)
  } catch (error) {
    next(error)
  }
}
const getTvVideo = async (req, res, next) => {
  try {
    const { mediaId, episodeId, seasonNumber, episodeNumber } = req.params

    const mediaVideo = await videoService.getTvVideo({ mediaId, episodeId, seasonNumber, episodeNumber })
    res.status(StatusCodes.CREATED).json(mediaVideo)
  } catch (error) {
    next(error)
  }
}
export const videoController = {
  getMovieVideo,
  getTvVideo
}

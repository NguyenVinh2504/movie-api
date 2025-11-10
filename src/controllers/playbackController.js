const { StatusCodes } = require('http-status-codes')
const { playbackService } = require('~/services/playbackService')

const getMoviePlayback = async (req, res, next) => {
  try {
    const { tmdbId } = req.params

    const playbackData = await playbackService.getMoviePlayback({
      tmdbId
    })
    res.status(StatusCodes.OK).json(playbackData)
  } catch (error) {
    next(error)
  }
}

const getTvPlayback = async (req, res, next) => {
  try {
    const { tmdbId, episode_id, season, episode } = req.validatedData

    const playbackData = await playbackService.getTvPlayback({
      tmdbId,
      episodeId: episode_id,
      seasonNumber: season,
      episodeNumber: episode
    })
    res.status(StatusCodes.OK).json(playbackData)
  } catch (error) {
    next(error)
  }
}

export const playbackController = {
  getMoviePlayback,
  getTvPlayback
}

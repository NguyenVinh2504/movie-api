import { StatusCodes } from 'http-status-codes'
import { linkService } from '~/services/linkService'
import ApiError from '~/utils/ApiError'

// ============================================
// MOVIE VIDEO LINKS
// ============================================

const addMovieVideoLink = async (req, res, next) => {
  try {
    const { movieId } = req.params
    const result = await linkService.addMovieVideoLink(movieId, req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const updateMovieVideoLink = async (req, res, next) => {
  try {
    const { movieId, linkId } = req.params
    const result = await linkService.updateMovieVideoLink(movieId, linkId, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteMovieVideoLink = async (req, res, next) => {
  try {
    const { movieId, linkId } = req.params
    const result = await linkService.deleteMovieVideoLink(movieId, linkId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

// ============================================
// MOVIE SUBTITLE LINKS
// ============================================

const addMovieSubtitleLink = async (req, res, next) => {
  try {
    const { movieId } = req.params
    const { file } = req

    // Validate: phải có file hoặc url
    if (!file && !req.body.url) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Phải cung cấp file (multipart/form-data) hoặc url (JSON)')
    }

    // Pass file và subtitleLinkData trực tiếp cho service
    const result = await linkService.addMovieSubtitleLink(movieId, req.body, file)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const updateMovieSubtitleLink = async (req, res, next) => {
  try {
    const { movieId, linkId } = req.params
    const { file } = req

    // Pass file và updateData trực tiếp cho service
    const result = await linkService.updateMovieSubtitleLink(movieId, linkId, req.body, file)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteMovieSubtitleLink = async (req, res, next) => {
  try {
    const { movieId, linkId } = req.params
    const result = await linkService.deleteMovieSubtitleLink(movieId, linkId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

// ============================================
// EPISODE VIDEO LINKS
// ============================================

const addEpisodeVideoLink = async (req, res, next) => {
  try {
    const { tvShowId, episodeId } = req.params
    const result = await linkService.addEpisodeVideoLink(tvShowId, episodeId, req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const updateEpisodeVideoLink = async (req, res, next) => {
  try {
    const { tvShowId, episodeId, linkId } = req.params
    const result = await linkService.updateEpisodeVideoLink(tvShowId, episodeId, linkId, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteEpisodeVideoLink = async (req, res, next) => {
  try {
    const { tvShowId, episodeId, linkId } = req.params
    const result = await linkService.deleteEpisodeVideoLink(tvShowId, episodeId, linkId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

// ============================================
// EPISODE SUBTITLE LINKS
// ============================================

const addEpisodeSubtitleLink = async (req, res, next) => {
  try {
    const { tvShowId, episodeId } = req.params
    const { file } = req

    // Validate: phải có file hoặc url
    if (!file && !req.body.url) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Phải cung cấp file (multipart/form-data) hoặc url (JSON)')
    }

    // Pass file và subtitleLinkData trực tiếp cho service
    const result = await linkService.addEpisodeSubtitleLink(tvShowId, episodeId, req.body, file)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const updateEpisodeSubtitleLink = async (req, res, next) => {
  try {
    const { tvShowId, episodeId, linkId } = req.params
    const { file } = req

    // Pass file và updateData trực tiếp cho service
    const result = await linkService.updateEpisodeSubtitleLink(tvShowId, episodeId, linkId, req.body, file)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteEpisodeSubtitleLink = async (req, res, next) => {
  try {
    const { tvShowId, episodeId, linkId } = req.params
    const result = await linkService.deleteEpisodeSubtitleLink(tvShowId, episodeId, linkId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const linkController = {
  // Movie Video Links
  addMovieVideoLink,
  updateMovieVideoLink,
  deleteMovieVideoLink,

  // Movie Subtitle Links
  addMovieSubtitleLink,
  updateMovieSubtitleLink,
  deleteMovieSubtitleLink,

  // Episode Video Links
  addEpisodeVideoLink,
  updateEpisodeVideoLink,
  deleteEpisodeVideoLink,

  // Episode Subtitle Links
  addEpisodeSubtitleLink,
  updateEpisodeSubtitleLink,
  deleteEpisodeSubtitleLink
}

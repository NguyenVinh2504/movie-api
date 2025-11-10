/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import resolveLangCode from '~/helpers/resolveLangCode'
import { episodeModel } from '~/models/episodeModel'
import { videoMediaModel } from '~/models/videoMeidaModel'
import ApiError from '~/utils/ApiError'
import { generateR2Key } from '~/utils/generateR2Key'
import { subtitleService } from '~/services/subtitle.service'

// ============================================
// MOVIE VIDEO LINKS
// ============================================

const addMovieVideoLink = async (movieId, videoLinkData) => {
  try {
    // Kiểm tra movie tồn tại
    const movie = await videoMediaModel.findById(movieId)
    if (!movie) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Movie không tồn tại.')
    }

    // Thêm video link (model tự sinh _id)
    const updatedMovie = await videoMediaModel.addVideoLink(movieId, videoLinkData)

    return {
      status: 'success',
      message: 'Thêm video link thành công.',
      data: updatedMovie
    }
  } catch (error) {
    throw error
  }
}

const updateMovieVideoLink = async (movieId, linkId, updateData) => {
  try {
    // Kiểm tra movie tồn tại
    const movie = await videoMediaModel.findById(movieId)
    if (!movie) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Movie không tồn tại.')
    }

    // Cập nhật video link
    const updatedMovie = await videoMediaModel.updateVideoLink(movieId, linkId, updateData)

    if (!updatedMovie) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Video link không tồn tại.')
    }

    return {
      status: 'success',
      message: 'Cập nhật video link thành công.',
      data: updatedMovie
    }
  } catch (error) {
    throw error
  }
}

const deleteMovieVideoLink = async (movieId, linkId) => {
  try {
    // Kiểm tra movie tồn tại
    const movie = await videoMediaModel.findById(movieId)
    if (!movie) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Movie không tồn tại.')
    }

    // Xóa video link
    const updatedMovie = await videoMediaModel.deleteVideoLink(movieId, linkId)

    if (!updatedMovie) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Video link không tồn tại.')
    }

    return {
      status: 'success',
      message: 'Xóa video link thành công.',
      data: { deletedId: String(linkId) }
    }
  } catch (error) {
    throw error
  }
}

// ============================================
// MOVIE SUBTITLE LINKS
// ============================================

const addMovieSubtitleLink = async (movieId, subtitleLinkData, file = null) => {
  try {
    // Kiểm tra movie tồn tại
    const movie = await videoMediaModel.findById(movieId)
    if (!movie) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Movie không tồn tại.')
    }

    let processedData = { ...subtitleLinkData }

    // Nếu có file thì upload lên R2
    if (file) {
      // Generate R2 key
      const r2Key = generateR2Key({
        mediaId: movieId,
        mediaType: 'movie',
        fileName: file.originalname,
        mediaTitle: movie.title
      })

      // Upload file lên R2
      const { r2_key } = await subtitleService.uploadFileToR2({ file, r2Key })

      // Merge upload metadata vào processedData
      processedData = {
        ...subtitleLinkData,
        r2_key,
        source: 'upload',
        kind: subtitleLinkData.kind || 'subtitles',
        lang: subtitleLinkData.lang || resolveLangCode(subtitleLinkData.label)
      }
    } else {
      // External URL - xử lý language code
      processedData = {
        ...subtitleLinkData,
        lang: subtitleLinkData.lang || resolveLangCode(subtitleLinkData.label),
        kind: subtitleLinkData.kind || 'subtitles',
        source: 'external'
      }
    }

    // Thêm subtitle link (model tự sinh _id)
    const updatedMovie = await videoMediaModel.addSubtitleLink(movieId, processedData)

    return {
      status: 'success',
      message: 'Thêm subtitle link thành công.',
      data: updatedMovie
    }
  } catch (error) {
    throw error
  }
}

const updateMovieSubtitleLink = async (movieId, linkId, updateData, file = null) => {
  try {
    // Kiểm tra movie tồn tại
    const movie = await videoMediaModel.findById(movieId)
    if (!movie) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Movie không tồn tại.')
    }

    // Tìm subtitle link hiện tại
    const subtitleLink = await videoMediaModel.findSubtitleLinkById(movieId, linkId)
    if (!subtitleLink) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Subtitle link không tồn tại.')
    }

    let processedData = { ...updateData }

    // Không cho phép set url khi subtitle link là nguồn upload
    if ((subtitleLink?.source === 'upload' || subtitleLink?.r2_key) && typeof processedData.url !== 'undefined') {
      const urlValue = processedData.url
      const isNonNullUrl = urlValue !== null && String(urlValue).trim() !== ''
      if (isNonNullUrl) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Không thể cập nhật "url" cho subtitle link nguồn upload.')
      }
      // Nếu client cố tình gửi url=null/empty, loại bỏ để tránh ghi đè không cần thiết
      delete processedData.url
    }

    // Nếu có file thì replace file trong R2
    if (file) {
      if (!subtitleLink.r2_key) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Subtitle link này không phải là file upload, không thể replace')
      }

      // Xóa file cũ khỏi R2
      await subtitleService.deleteFileFromR2(subtitleLink.r2_key)

      // Generate R2 key mới (giữ nguyên structure)
      const r2Key = generateR2Key({
        mediaId: movieId,
        mediaType: 'movie',
        fileName: file.originalname,
        mediaTitle: movie.title
      })

      // Upload file mới lên R2
      const { r2_key } = await subtitleService.uploadFileToR2({ file, r2Key })

      // Merge upload metadata vào processedData
      processedData = {
        ...updateData,
        r2_key,
        source: 'upload' // Đảm bảo source vẫn là upload
      }
    }

    // Xử lý language code nếu label thay đổi (business logic)
    if (processedData.label && !processedData.lang) {
      processedData.lang = resolveLangCode(processedData.label)
    }

    // Cập nhật subtitle link
    const updatedMovie = await videoMediaModel.updateSubtitleLink(movieId, linkId, processedData)

    if (!updatedMovie) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Subtitle link không tồn tại.')
    }

    return {
      status: 'success',
      message: 'Cập nhật subtitle link thành công.',
      data: updatedMovie
    }
  } catch (error) {
    throw error
  }
}

const deleteMovieSubtitleLink = async (movieId, linkId) => {
  try {
    // Kiểm tra movie tồn tại
    const movie = await videoMediaModel.findById(movieId)
    if (!movie) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Movie không tồn tại.')
    }

    // Tìm subtitle link để kiểm tra có r2_key không
    const subtitleLink = await videoMediaModel.findSubtitleLinkById(movieId, linkId)

    // Xóa subtitle link
    const updatedMovie = await videoMediaModel.deleteSubtitleLink(movieId, linkId)

    if (!updatedMovie) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Subtitle link không tồn tại.')
    }

    // Nếu có r2_key và source = "upload", xóa file khỏi R2
    if (subtitleLink?.r2_key && subtitleLink?.source === 'upload') {
      await subtitleService.deleteFileFromR2(subtitleLink.r2_key)
    }

    return {
      status: 'success',
      message: 'Xóa subtitle link thành công.',
      data: { deletedId: String(linkId) }
    }
  } catch (error) {
    throw error
  }
}

// ============================================
// EPISODE VIDEO LINKS
// ============================================

const addEpisodeVideoLink = async (tvShowId, episodeId, videoLinkData) => {
  try {
    // Kiểm tra TV show tồn tại
    const tvShow = await videoMediaModel.findById(tvShowId)
    if (!tvShow) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'TV show không tồn tại.')
    }

    // Kiểm tra episode tồn tại và thuộc TV show
    const episode = await episodeModel.findOne({
      _id: new ObjectId(episodeId),
      tv_show_id: new ObjectId(tvShowId)
    })
    if (!episode) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Episode không tồn tại hoặc không thuộc TV show này.')
    }

    // Thêm video link (model tự sinh _id)
    const updatedEpisode = await episodeModel.addVideoLink({ tvShowId, episodeId, videoLinkData })

    return {
      status: 'success',
      message: 'Thêm video link thành công.',
      data: updatedEpisode
    }
  } catch (error) {
    throw error
  }
}

const updateEpisodeVideoLink = async (tvShowId, episodeId, linkId, updateData) => {
  try {
    // Kiểm tra TV show tồn tại
    const tvShow = await videoMediaModel.findById(tvShowId)
    if (!tvShow) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'TV show không tồn tại.')
    }

    // Kiểm tra episode tồn tại và thuộc TV show
    const episode = await episodeModel.findOne({
      _id: new ObjectId(episodeId),
      tv_show_id: new ObjectId(tvShowId)
    })
    if (!episode) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Episode không tồn tại hoặc không thuộc TV show này.')
    }

    // Cập nhật video link
    const updatedEpisode = await episodeModel.updateVideoLink({ tvShowId, episodeId, linkId, updateData })

    if (!updatedEpisode) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Video link không tồn tại.')
    }

    return {
      status: 'success',
      message: 'Cập nhật video link thành công.',
      data: updatedEpisode
    }
  } catch (error) {
    throw error
  }
}

const deleteEpisodeVideoLink = async (tvShowId, episodeId, linkId) => {
  try {
    // Kiểm tra TV show tồn tại
    const tvShow = await videoMediaModel.findById(tvShowId)
    if (!tvShow) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'TV show không tồn tại.')
    }

    // Kiểm tra episode tồn tại và thuộc TV show
    const episode = await episodeModel.findOne({
      _id: new ObjectId(episodeId),
      tv_show_id: new ObjectId(tvShowId)
    })
    if (!episode) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Episode không tồn tại hoặc không thuộc TV show này.')
    }

    // Xóa video link
    const updatedEpisode = await episodeModel.deleteVideoLink({ tvShowId, episodeId, linkId })

    if (!updatedEpisode) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Video link không tồn tại.')
    }

    return {
      status: 'success',
      message: 'Xóa video link thành công.',
      data: { deletedId: String(linkId) }
    }
  } catch (error) {
    throw error
  }
}

// ============================================
// EPISODE SUBTITLE LINKS
// ============================================

const addEpisodeSubtitleLink = async (tvShowId, episodeId, subtitleLinkData, file = null) => {
  try {
    // Kiểm tra TV show tồn tại
    const tvShow = await videoMediaModel.findById(tvShowId)
    if (!tvShow) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'TV show không tồn tại.')
    }

    // Kiểm tra episode tồn tại và thuộc TV show
    const episode = await episodeModel.findOne({
      _id: new ObjectId(episodeId),
      tv_show_id: new ObjectId(tvShowId)
    })
    if (!episode) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Episode không tồn tại hoặc không thuộc TV show này.')
    }

    let processedData = { ...subtitleLinkData }

    // Nếu có file thì upload lên R2
    if (file) {
      // Generate R2 key
      const r2Key = generateR2Key({
        mediaId: tvShowId,
        mediaType: 'tv',
        fileName: file.originalname,
        mediaTitle: tvShow.name,
        seasonNumber: episode.season_number,
        episodeNumber: episode.episode_number
      })

      // Upload file lên R2
      const { r2_key } = await subtitleService.uploadFileToR2({ file, r2Key })

      // Merge upload metadata vào processedData
      processedData = {
        ...subtitleLinkData,
        r2_key,
        source: 'upload',
        kind: subtitleLinkData.kind || 'subtitles',
        lang: subtitleLinkData.lang || resolveLangCode(subtitleLinkData.label)
      }
    } else {
      // External URL - xử lý language code
      processedData = {
        ...subtitleLinkData,
        lang: subtitleLinkData.lang || resolveLangCode(subtitleLinkData.label),
        kind: subtitleLinkData.kind || 'subtitles',
        source: 'external'
      }
    }

    const updatedEpisode = await episodeModel.addSubtitleLink({ tvShowId, episodeId, subtitleLinkData: processedData })

    return {
      status: 'success',
      message: 'Thêm subtitle link thành công.',
      data: updatedEpisode
    }
  } catch (error) {
    throw error
  }
}

const updateEpisodeSubtitleLink = async (tvShowId, episodeId, linkId, updateData, file = null) => {
  try {
    // Kiểm tra TV show tồn tại
    const tvShow = await videoMediaModel.findById(tvShowId)
    if (!tvShow) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'TV show không tồn tại.')
    }

    // Kiểm tra episode tồn tại và thuộc TV show
    const episode = await episodeModel.findOne({
      _id: new ObjectId(episodeId),
      tv_show_id: new ObjectId(tvShowId)
    })
    if (!episode) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Episode không tồn tại hoặc không thuộc TV show này.')
    }

    // Tìm subtitle link hiện tại
    const subtitleLink = await episodeModel.findSubtitleLinkById(episodeId, linkId)
    if (!subtitleLink) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Subtitle link không tồn tại.')
    }

    let processedData = { ...updateData }

    // Không cho phép set url khi subtitle link là nguồn upload
    if ((subtitleLink?.source === 'upload' || subtitleLink?.r2_key) && typeof processedData.url !== 'undefined') {
      const urlValue = processedData.url
      const isNonNullUrl = urlValue !== null && String(urlValue).trim() !== ''
      if (isNonNullUrl) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Không thể cập nhật "url" cho subtitle link nguồn upload.')
      }
      // Nếu client cố tình gửi url=null/empty, loại bỏ để tránh ghi đè không cần thiết
      delete processedData.url
    }

    // Nếu có file thì replace file trong R2
    if (file) {
      if (!subtitleLink.r2_key) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Subtitle link này không phải là file upload, không thể replace')
      }

      // Xóa file cũ khỏi R2
      await subtitleService.deleteFileFromR2(subtitleLink.r2_key)

      // Generate R2 key mới (giữ nguyên structure)
      const r2Key = generateR2Key({
        mediaId: tvShowId,
        mediaType: 'tv',
        fileName: file.originalname,
        mediaTitle: tvShow.name,
        seasonNumber: episode.season_number,
        episodeNumber: episode.episode_number
      })

      // Upload file mới lên R2
      const { r2_key } = await subtitleService.uploadFileToR2({ file, r2Key })

      // Merge upload metadata vào processedData
      processedData = {
        ...updateData,
        r2_key,
        source: 'upload' // Đảm bảo source vẫn là upload
      }
    }

    // Xử lý language code nếu label thay đổi (business logic)
    if (processedData.label && !processedData.lang) {
      processedData.lang = resolveLangCode(processedData.label)
    }

    // Cập nhật subtitle link
    const updatedEpisode = await episodeModel.updateSubtitleLink({
      tvShowId,
      episodeId,
      linkId,
      updateData: processedData
    })

    if (!updatedEpisode) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Subtitle link không tồn tại.')
    }

    return {
      status: 'success',
      message: 'Cập nhật subtitle link thành công.',
      data: updatedEpisode
    }
  } catch (error) {
    throw error
  }
}

const deleteEpisodeSubtitleLink = async (tvShowId, episodeId, linkId) => {
  try {
    // Kiểm tra TV show tồn tại
    const tvShow = await videoMediaModel.findById(tvShowId)
    if (!tvShow) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'TV show không tồn tại.')
    }

    // Kiểm tra episode tồn tại và thuộc TV show
    const episode = await episodeModel.findOne({
      _id: new ObjectId(episodeId),
      tv_show_id: new ObjectId(tvShowId)
    })
    if (!episode) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Episode không tồn tại hoặc không thuộc TV show này.')
    }

    // Tìm subtitle link để kiểm tra có r2_key không
    const subtitleLink = await episodeModel.findSubtitleLinkById(episodeId, linkId)

    // Xóa subtitle link
    const updatedEpisode = await episodeModel.deleteSubtitleLink({ tvShowId, episodeId, linkId })

    if (!updatedEpisode) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Subtitle link không tồn tại.')
    }

    // Nếu có r2_key và source = "upload", xóa file khỏi R2
    if (subtitleLink?.r2_key && subtitleLink?.source === 'upload') {
      await subtitleService.deleteFileFromR2(subtitleLink.r2_key)
    }

    return {
      status: 'success',
      message: 'Xóa subtitle link thành công.',
      data: { deletedId: String(linkId) }
    }
  } catch (error) {
    throw error
  }
}

export const linkService = {
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

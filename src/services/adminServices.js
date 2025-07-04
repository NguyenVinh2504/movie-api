/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import resolveLangCode from '~/helpers/resolveLangCode'
import { videoMediaModel } from '~/models/videoMeidaModel'
import ApiError from '~/utils/ApiError'

const getPaginatedList = async (fetchFn, { page, pageSize }, message) => {
  try {
    const results = await fetchFn({ page, pageSize })
    const data = results[0].data
    const totalItems = results[0].pagination[0] ? results[0].pagination[0].totalItems : 0
    const totalPages = Math.ceil(totalItems / pageSize)
    return {
      status: 'success',
      message,
      data,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: pageSize
      }
    }
  } catch (error) {
    throw error
  }
}

const createMovie = async (body) => {
  try {
    // Kiểm tra trùng tmdb_id
    const existed = await videoMediaModel.findMediaByTmdbId(body.tmdb_id, 'movie')
    if (existed) {
      throw new ApiError(StatusCodes.CONFLICT, 'Phim với tmdb_id này đã tồn tại trong hệ thống.')
    }

    // Chuẩn hóa subtitle_links
    const subtitle_links = (body.subtitle_links || []).map((sub) => ({
      ...sub,
      lang: resolveLangCode(sub.label)
    }))
    const data = {
      ...body,
      media_type: 'movie',
      subtitle_links
    }
    // Validate và thêm vào DB
    const createdMovie = await videoMediaModel.createMovie(data)
    return createdMovie
  } catch (error) {
    // Xử lý lỗi validation
    throw error
  }
}

// Sử dụng:
const getMovieList = (params) => getPaginatedList(videoMediaModel.getMovieList, params, 'Lấy danh sách phim thành công')

const getMediaById = async (mediaId) => {
  try {
    const movie = await videoMediaModel.findById(mediaId)
    if (!movie) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Phim không tồn tại.')
    }
    return {
      status: 'success',
      message: 'Lấy thông tin phim thành công',
      data: movie
    }
  } catch (error) {
    throw error
  }
}

const updateMovie = async (idMovie, reqBody) => {
  try {
    // const movie = await videoMediaModel.findById(idMovie)
    // if (!movie) {
    //   throw new ApiError(StatusCodes.NOT_FOUND, 'Phim không tồn tại.')
    // }
    const { status, video_links, subtitle_links, title, poster_path } = reqBody

    const processedSubtitles = subtitle_links.map((sub) => ({
      ...sub,
      lang: resolveLangCode(sub.label),
      kind: 'subtitle'
    }))

    const updateData = {
      status,
      title,
      poster_path,
      video_links,
      subtitle_links: processedSubtitles,
      updatedAt: new Date()
    }

    const updatedMovie = await videoMediaModel.update({ mediaId: idMovie, updateData, media_type: 'movie' })

    return {
      status: 'success',
      message: 'Cập nhật thông tin phim thành công',
      data: updatedMovie
    }
  } catch (error) {
    throw error
  }
}

const deleteMedia = async (idMovie) => {
  try {
    const movie = await videoMediaModel.findById(idMovie)
    if (!movie) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Phim không tồn tại.')
    } else {
      await videoMediaModel.deleteOneById(idMovie)
      return {
        status: 'success',
        message: 'Xóa phim thành công'
      }
    }
  } catch (error) {
    throw error
  }
}

const createTvShow = async (body) => {
  try {
    // Kiểm tra trùng tmdb_id
    const existed = await videoMediaModel.findMediaByTmdbId(body.tmdb_id, 'tv')
    if (existed) {
      throw new ApiError(StatusCodes.CONFLICT, 'Phim với tmdb_id này đã tồn tại trong hệ thống.')
    }
    body.seasons
      .flatMap((s) => s.episodes)
      .flatMap((e) => e.subtitle_links)
      .forEach((sub) => (sub.lang = resolveLangCode(sub.label)))

    const data = {
      ...body,
      media_type: 'tv'
    }

    // Validate và thêm vào DB
    const createdTvShow = await videoMediaModel.createTvShow(data)
    return createdTvShow
  } catch (error) {
    // Xử lý lỗi validation
    throw error
  }
}

const getTvShowList = (params) =>
  getPaginatedList(videoMediaModel.getTvShowList, params, 'Lấy danh sách phim thành công')

const updateTvShow = async (idTvShow, reqBody) => {
  try {
    // const tvShow = await videoMediaModel.findById(idTvShow)
    // if (!tvShow) {
    //   throw new ApiError(StatusCodes.NOT_FOUND, 'Phim không tồn tại.')
    // }
    reqBody.seasons
      .flatMap((s) => s.episodes)
      .flatMap((e) => e.subtitle_links)
      .forEach((sub) => (sub.lang = resolveLangCode(sub.label)))

    const { status, name, poster_path, seasons } = reqBody

    const updateData = {
      status,
      name,
      poster_path,
      seasons,
      updatedAt: new Date()
    }

    const updatedTvShow = await videoMediaModel.update({ media_type: 'tv', mediaId: idTvShow, updateData })

    return {
      status: 'success',
      message: 'Cập nhật thông tin phim thành công',
      data: updatedTvShow
    }
  } catch (error) {
    throw error
  }
}

export const adminService = {
  createMovie,
  getMovieList,
  getMediaById,
  updateMovie,
  deleteMedia,
  //Tv Show
  createTvShow,
  getTvShowList,
  updateTvShow
}

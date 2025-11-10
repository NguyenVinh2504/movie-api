import { StatusCodes } from 'http-status-codes'
import { adminService } from '~/services/adminServices'

// Helper để lấy phân trang từ query
const getPagingParams = (req) => ({
  page: parseInt(req.query.page, 10) || 1,
  pageSize: parseInt(req.query.pageSize, 10) || 5
})

const updateMedia = async (req, res, next, fetchFn) => {
  try {
    const reqBody = req.body
    const idMedia = req.params.mediaId

    const results = await fetchFn(idMedia, reqBody)
    res.status(StatusCodes.OK).json(results)
  } catch (error) {
    next(error)
  }
}

const getMediaById = async (req, res, next) => {
  try {
    const results = await adminService.getMediaById(req.params.mediaId)
    res.status(StatusCodes.OK).json(results)
  } catch (error) {
    next(error)
  }
}

const deleteMedia = async (req, res, next) => {
  try {
    const mediaId = req.params.mediaId

    const results = await adminService.deleteMedia(mediaId)
    res.status(StatusCodes.OK).json(results)
  } catch (error) {
    next(error)
  }
}

const createMovie = async (req, res, next) => {
  try {
    //Điều hướng dữ liệu sang tầng Service, rồi Service trả dữ liệu về
    const movie = await adminService.createMovie(req.body)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(
      //dữ liệu từ service
      movie
    )
  } catch (error) {
    // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
    next(error)
  }
}

const getMovieList = async (req, res, next) => {
  try {
    const { page, pageSize } = getPagingParams(req)
    const results = await adminService.getMovieList({ page, pageSize })
    res.status(StatusCodes.OK).json(results)
  } catch (error) {
    next(error)
  }
}

const updateMovie = (req, res, next) => {
  return updateMedia(req, res, next, adminService.updateMovie)
}

const createTvShow = async (req, res, next) => {
  try {
    //Điều hướng dữ liệu sang tầng Service, rồi Service trả dữ liệu về
    const tvShow = await adminService.createTvShow(req.body)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(
      //dữ liệu từ service
      tvShow
    )
  } catch (error) {
    // Có lỗi thì đẩy ra Middleware xử lý lỗi tập trung
    next(error)
  }
}

const getTvShowList = async (req, res, next) => {
  try {
    const { page, pageSize } = getPagingParams(req)
    const results = await adminService.getTvShowList({ page, pageSize })
    res.status(StatusCodes.OK).json(results)
  } catch (error) {
    next(error)
  }
}

const updateTvShow = async (req, res, next) => {
  return updateMedia(req, res, next, adminService.updateTvShow)
}

const addEpisode = async (req, res, next) => {
  try {
    const { tvShowId } = req.params
    const episodeData = req.body
    // Gọi service để thêm tập phim, truyền vào cả tvShowId và dữ liệu tập phim
    const newEpisode = await adminService.addEpisode(tvShowId, episodeData)

    res.status(StatusCodes.CREATED).json(newEpisode)
  } catch (error) {
    next(error)
  }
}

const getEpisodeList = async (req, res, next) => {
  try {
    const { tvShowId } = req.params
    const { page, pageSize } = req.query

    const result = await adminService.getEpisodeList(tvShowId, { page, pageSize })
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getEpisodeDetails = async (req, res, next) => {
  try {
    const { tvShowId, episodeId } = req.params
    const result = await adminService.getEpisodeDetails(tvShowId, episodeId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getEpisodeDetailsByTmdbId = async (req, res, next) => {
  try {
    const { tvShowId } = req.params
    const { episodeTmdbId } = req.query
    const result = await adminService.getEpisodeDetailsByTmdbId({ tvShowId, episodeTmdbId })
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateEpisode = async (req, res, next) => {
  try {
    const { tvShowId, episodeId } = req.params
    const result = await adminService.updateEpisode(tvShowId, episodeId, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteEpisode = async (req, res, next) => {
  try {
    const { tvShowId, episodeId } = req.params
    const result = await adminService.deleteEpisode(tvShowId, episodeId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const adminController = {
  createMovie,
  getMovieList,
  updateMovie,
  //Tv Show
  createTvShow,
  getTvShowList,
  updateTvShow,

  addEpisode,
  getEpisodeList,
  updateEpisode,
  deleteEpisode,
  getEpisodeDetails,
  getEpisodeDetailsByTmdbId,

  getMediaById,
  deleteMedia
}

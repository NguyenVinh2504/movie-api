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
    const idMedia = req.params.mediaId

    const results = await adminService.deleteMedia(idMedia)
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

export const adminController = {
  createMovie,
  getMovieList,
  updateMovie,
  //Tv Show
  createTvShow,
  getTvShowList,
  updateTvShow,

  getMediaById,
  deleteMedia
}

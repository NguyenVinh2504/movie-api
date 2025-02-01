import { StatusCodes } from 'http-status-codes'
import { movieVideoModel } from '~/models/movieVideoModel'
// import { favoriteModel } from '~/models/favoriteModel'
import tmdbApi from '~/tmdb/tmdb.api'
import ApiError from '~/utils/ApiError'
// import tokenMiddleware from '~/middlewares/token.middleware'
const getList = async (req) => {
  try {
    const { page } = req.query
    const { mediaType, mediaCategory } = req.params
    const response = await tmdbApi.mediaList({ mediaType, mediaCategory, page })
    // console.log('list');
    return response
  } catch {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Oops! Something worng!')
  }
}
const getTrending = async (req) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // console.log('trend');
    const { page } = req.query
    const { mediaType, timeWindow } = req.params
    const response = await tmdbApi.mediaTrending({ mediaType, timeWindow, page })
    // const access_token = req.headers['authorization']?.replace('Bearer ', '')
    // if (access_token) {
    //   const tokenDecoded = await tokenMiddleware.tokenDecode(access_token)
    //   if (tokenDecoded) {
    //     const favoriteList = await favoriteModel.findFavorite(tokenDecoded._id)
    //     if (favoriteList) {
    //       response.results.forEach((item) => {
    //         let isFavorite = favoriteList.find((element) => {
    //           return element.mediaId === item.id
    //         })
    //         if (isFavorite) {
    //           item.isFavorite = true
    //           item.favoriteId = isFavorite._id
    //         }
    //       })
    //     }
    //   }
    // }
    return response
  } catch (error) {
    // throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Oops! Something worng!')
    throw error
  }
}
const getDiscoverGenres = async (req) => {
  try {
    // console.log('the loai');
    const { with_genres, page } = req.query
    const { mediaType } = req.params
    const response = await tmdbApi.discoverGenres({ mediaType, page, with_genres })

    return response
  } catch {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Oops! Something worng!')
  }
}
const getGenres = async (req) => {
  try {
    const { mediaType } = req.params

    const response = await tmdbApi.mediaGenres({ mediaType })

    return response
  } catch {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Oops! Something worng!')
  }
}
const getDetail = async (req) => {
  try {
    //console.log('detail');
    const { mediaId, mediaType } = req.params
    const { append_to_response } = req.query
    const response = await tmdbApi.mediaDetail({ mediaType, mediaId, append_to_response })

    return response
  } catch {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Oops! Something worng!')
  }
}
const getDetailSeason = async (req) => {
  try {
    const { series_id, season_number } = req.params
    // console.log(series_id, season_number)
    const response = await tmdbApi.mediaSeasonDetail({ series_id, season_number })

    return response
  } catch {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Oops! Something worng!')
  }
}
const search = async (req) => {
  try {
    const { query, page } = req.query
    const { mediaType } = req.params
    const response = await tmdbApi.mediaSearch({
      query,
      page,
      mediaType
    })

    return response
  } catch (err) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Oops! Something worng!')
  }
}
// const search = async (req) => {
//     try {
//       const { mediaType } = req.params
//       const { query, page } = req.query
//       const response = await tmdbApi.mediaSearch({
//         query,
//         page,
//         mediaType: mediaType === 'people' ? 'person' : mediaType
//       })

//       return response
//     } catch {
//       throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Oops! Something worng!')
//     }
//   }

export const mediaService = {
  getList,
  getTrending,
  getDiscoverGenres,
  getGenres,
  getDetail,
  getDetailSeason,
  search
}

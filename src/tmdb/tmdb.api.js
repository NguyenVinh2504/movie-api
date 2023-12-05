import axiosClient from '../axios/axios.client.js'
import tmdbEndpoints from './tmdb.endpoints.js'

const tmdbApi = {
  mediaList: async ({ mediaType, mediaCategory, page }) => await axiosClient.get(
    tmdbEndpoints.mediaList({ mediaType, mediaCategory, page })
  ),
  mediaTrending: async ({ mediaType, timeWindow, page }) => await axiosClient.get(
    tmdbEndpoints.mediaTrending({ mediaType, timeWindow, page })
  ),
  discoverGenres: async ({ mediaType, with_genres, page }) => await axiosClient.get(
    tmdbEndpoints.discoverGenres({ mediaType, with_genres, page })
  ),
  mediaDetail: async ({ mediaType, mediaId, append_to_response }) => await axiosClient.get(
    tmdbEndpoints.mediaDetail({ mediaType, mediaId, append_to_response })
  ),
  mediaSeasonDetail: async ({ series_id, season_number }) => await axiosClient.get(
    tmdbEndpoints.mediaSeasonDetail({ series_id, season_number })
  ),
  mediaGenres: async ({ mediaType }) => await axiosClient.get(
    tmdbEndpoints.mediaGenres({ mediaType })
  ),
  mediaCredits: async ({ mediaType, mediaId }) => await axiosClient.get(
    tmdbEndpoints.mediaCredits({ mediaType, mediaId })
  ),
  mediaVideos: async ({ mediaType, mediaId }) => await axiosClient.get(
    tmdbEndpoints.mediaVideos({ mediaType, mediaId })
  ),
  mediaImages: async ({ mediaType, mediaId }) => await axiosClient.get(
    tmdbEndpoints.mediaImages({ mediaType, mediaId })
  ),
  mediaRecommend: async ({ mediaType, mediaId }) => await axiosClient.get(
    tmdbEndpoints.mediaRecommend({ mediaType, mediaId })
  ),
  mediaSearch: async ({ mediaType, query, page }) => await axiosClient.get(
    tmdbEndpoints.mediaSearch({ mediaType, query, page })
  ),
  personDetail: async ({ personId }) => await axiosClient.get(
    tmdbEndpoints.personDetail({ personId })
  ),
  personMedias: async ({ personId }) => await axiosClient.get(
    tmdbEndpoints.personMedias({ personId })
  )
}

export default tmdbApi
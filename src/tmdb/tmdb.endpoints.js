import tmdbConfig from './tmdb.config.js'

const tmdbEndpoints = {
  mediaList: ({ mediaType, mediaCategory, page }) => tmdbConfig.getUrl(
    `${mediaType}/${mediaCategory}`, { page }
  ),
  mediaTrending: ({ mediaType, timeWindow, page }) => tmdbConfig.getUrl(
    `trending/${mediaType}/${timeWindow}`, { page }
  ),
  discoverGenres: ({ mediaType, with_genres, page }) => tmdbConfig.getUrl(
    `discover/${mediaType}`, { with_genres, page }
  ),
  mediaDetail: ({ mediaType, mediaId, append_to_response }) => tmdbConfig.getUrl(
    `${mediaType}/${mediaId}`, { append_to_response }
  ),
  mediaSeasonDetail: ({ series_id, season_number }) => tmdbConfig.getUrl(
    `tv/${series_id}/season/${season_number}`
  ),
  mediaGenres: ({ mediaType }) => tmdbConfig.getUrl(
    `genre/${mediaType}/list`
  ),
  mediaCredits: ({ mediaType, mediaId }) => tmdbConfig.getUrl(
    `${mediaType}/${mediaId}/credits`
  ),
  mediaVideos: ({ mediaType, mediaId }) => tmdbConfig.getUrl(
    `${mediaType}/${mediaId}/videos`
  ),
  mediaRecommend: ({ mediaType, mediaId }) => tmdbConfig.getUrl(
    `${mediaType}/${mediaId}/recommendations`
  ),
  mediaImages: ({ mediaType, mediaId }) => tmdbConfig.getUrl(
    `${mediaType}/${mediaId}/images`
  ),
  mediaSearch: ({ mediaType, query, page }) => tmdbConfig.getUrl(
    `/search/${mediaType}`, { query, page }
  ),
  personDetail: ({ personId }) => tmdbConfig.getUrl(
    `person/${personId}`
  ),
  personMedias: ({ personId }) => tmdbConfig.getUrl(
    `person/${personId}/combined_credits`
  )
}

export default tmdbEndpoints
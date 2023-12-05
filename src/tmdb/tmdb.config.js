import { env } from '~/config/environment'
const baseUrl = env.TMDB_BASE_URL
const key = env.TMDB_KEY

const getUrl = (endpoint, params) => {
  const qs = new URLSearchParams(params)

  return `${baseUrl}${endpoint}?api_key=${key}&${qs}&language=en-US`
}

export default { getUrl }
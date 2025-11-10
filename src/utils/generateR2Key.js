import { sanitizeFileName } from '~/utils/sanitizeFileName'
import { randomUUID } from 'node:crypto'
import { slugify } from '~/utils/formatters'

/**
 * Generate R2 key theo format quy định
 * Movie: {movieId}/movie/{uuid}_{sanitizedFileName}
 * TV: {tvShowId}/s{seasonNumber}/e{episodeNumber}/{uuid}_{sanitizedFileName}
 */
export const generateR2Key = ({ mediaId, mediaTitle, mediaType, seasonNumber, episodeNumber, fileName }) => {
  const fileId = randomUUID()
  const sanitizedFileName = sanitizeFileName(fileName)
  const sanitizedMediaTitle = slugify(mediaTitle)
  if (mediaType === 'tv') {
    // Format: {tvShowId}/s{seasonNumber}/e{episodeNumber}/{uuid}_{sanitizedFileName}
    const seasonPadded = seasonNumber.toString().padStart(2, '0')
    const episodePadded = episodeNumber.toString().padStart(2, '0')
    return `tv/${sanitizedMediaTitle}_${mediaId}/s${seasonPadded.padStart(2, '0')}/e${episodePadded.padStart(2, '0')}/${fileId}_${sanitizedFileName}`
  } else {
    // Format: {movieId}/movie/{uuid}_{sanitizedFileName}
    return `movie/${sanitizedMediaTitle}_${mediaId}/${fileId}_${sanitizedFileName}`
  }
}

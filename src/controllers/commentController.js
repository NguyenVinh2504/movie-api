import { StatusCodes } from 'http-status-codes'
import { commentService } from '~/services/commentService'

const addComment = async (req, res) => {
  const data = await commentService.addComment(req, res)
  res.status(StatusCodes.CREATED).json({
    message: 'Add comment successfully',
    data
  })
}

const getCommentsByMovieId = async (req, res) => {
  const data = await commentService.getCommentsByMovieId(req, res)
  res.status(StatusCodes.OK).json({
    message: 'Get comment successfully',
    data
  })
}
export const commentController = {
  addComment,
  getCommentsByMovieId
}

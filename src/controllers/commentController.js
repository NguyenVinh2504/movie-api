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
  const { movieId, movieType } = req.params

  const limit = req.query.limit
  const page = req.query.page

  const data = await commentService.getCommentsByMovieId({ movieId, movieType, limit, page })
  const totalPage = Math.ceil(data.total / limit)
  res.status(StatusCodes.OK).json({
    message: 'Get comment successfully',
    totalPage: totalPage !== 0 ? totalPage : 1,
    limit,
    page,
    totalComment: data.total,
    listComment: data.listComments
  })
}
export const commentController = {
  addComment,
  getCommentsByMovieId
}
